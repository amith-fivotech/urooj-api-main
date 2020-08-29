import { Injectable, NotFoundException, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAuthDto } from './dto/user-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { Roles } from 'src/common/enum/roles.enum';
import { sendEmail } from 'src/utils/send-email';
import * as csurf from 'csurf';

@Injectable()
export class UsersService {
    private logger = new Logger('User Service');
    constructor(
        @InjectRepository(UsersRepository)
        private userRepository: UsersRepository,
        private jwtService: JwtService,
    ) {
        this.checkIfMasterAdminExistsAndAdd();
    }

    async getAllUsers(): Promise<Users[]> {
        return await this.userRepository.find({
            select: ["id", "name", "email", "status", "createdBy"]
        });
    }

    async getUserById(id: string): Promise<Users> {
        let found = null
        try {
            found = await this.userRepository.findOne(id, {
                select: [
                    "id", "name", "email", "status", "createdBy"
                ]
            });
            if (!found) {
                throw new NotFoundException(`User with ID: ${id} was not found`);
            }
        } catch (err) {
            this.logger.error(err.stack);
            throw new NotFoundException(`User with ID: ${id} was not found`);
        }
        return found;
    }

    async createNewUser(
        createUser: CreateUserDto,
        user: Users
        ): Promise<void> {
        return this.userRepository.newUser(createUser, user);
    }

    async deleteUser(id: string): Promise<void> {
        try {
            const result = await this.userRepository.delete(id);
    
            if (result.affected === 0) {
                throw new NotFoundException(`User with ID: ${id} was not found`);
            }
        } catch (err) {
            this.logger.error(err.stack);
            throw new NotFoundException(`User with ID: ${id} was not found`);
        }
    }

    async authenticateUser(userAuthDto: UserAuthDto): Promise<{accessToken: string}> {
        const users = await this.userRepository.validateUserPassword(userAuthDto);

        if (!users) {
            throw new UnauthorizedException('Invalid Credentials');
        }
        const { id, name, email } = users;
        const payload: JwtPayload = { 
            id, name, email
         };
        const accessToken = await this.jwtService.sign(payload);
        /* const csrfToken = req.csrfToken();
        res.cookie('CSRF-Token', csrfToken);
        console.log(csrfToken, 'csrf'); */
        return { accessToken };
    }

    async checkIfMasterAdminExistsAndAdd(): Promise<void> {
        const adminUser = await this.userRepository.findOne({
            where: {
                email: 'admin@mca.com'
            }
        });
        if (!adminUser) {
            return await this.createNewUser({
                name: 'Admin', email: 'admin@mca.com',
                password: 'mca@123'
            }, null);
        }
    }


    async verifyUser(email: string): Promise<{otp: number}> {
        const user = await this.userRepository.findOne({
            where: {
                email: email
            }
        });
        if (user) {
            const random = Math.floor(Math.random() * 10000);
            user.otp = random;
            user.save();
            const message = `You are receiving this email because you (or someone else) has
            requested the reset of a password. Please make a PUT request to: \n\n ${random}`;

            try {
                await sendEmail({
                    email: email,
                    subject: 'Verify User',
                    message
                });
            } catch (error) {
                console.log('error', error);
            }

            return {otp: random};
        }
    }

    async verifyOTP(otp, email): Promise<{result: boolean}> {
        const user = await this.userRepository.findOne({
            where: {
                email: email
            }
        });
        if (user) {
            if (user.otp === Number(otp)) {
                return { result: true }
            } else {
                return { result: false }
            }
        }
    }

}
