import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "src/users/interface/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersRepository } from "src/users/users.repository";
import { Users } from "src/users/users.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UsersRepository)
        private userRepository: UsersRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'topSecret51'
        })
    }

    async validate(payload: JwtPayload): Promise<Users> {
        const { id } = payload;
        const user = await this.userRepository.findOne(id);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}

