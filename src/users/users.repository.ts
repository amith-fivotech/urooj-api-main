import { Repository, EntityRepository } from "typeorm";
import { Users } from "./users.entity";
import { Logger, ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { DefaultStatusEnum } from "src/common/enum/default.status.enum";
import * as bcrypt from "bcryptjs";
import { UserAuthDto } from "./dto/user-auth.dto";
import { Roles } from "src/common/enum/roles.enum";

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
    private logger = new Logger('User Repository');

    async newUser(
        createUser: CreateUserDto,
        userData: Users
    ): Promise<void> {
        const {name, email, password} = createUser;
        const user = new Users();
        user.name = name;
        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.generatePassword(password, user.salt);
        user.createdBy = (userData) ? userData.id.toString() : "";
        user.status = DefaultStatusEnum.ACTIVE;

        try {
            await user.save();
            this.logger.log('Adding new User')
        } catch(err) {
            this.logger.error(err.stack);
            if (err.code === 11000) {
                throw new ConflictException('Email ID Already exisits');
            } else {
                throw new InternalServerErrorException('Somethig Went Wrong. Please check Log for more details');
            }
        }
    }

    async validateUserPassword(userAuthDto: UserAuthDto): Promise<Users> {
        const { email, password } = userAuthDto;
        const user = await this.findOne({ email });
        if (user && await user.validatePassword(password)) {
            return user;
        } else {
            return null;
        }
    }

    private async generatePassword(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }
}