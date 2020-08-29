import { Controller, Get, Param, Post, Body, ValidationPipe, Delete, UseGuards, Put, Request, Response } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAuthDto } from './dto/user-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/get-user.decorator';


@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(private _userService: UsersService) {}

    @Get()
    /* @ApiBearerAuth()
    @UseGuards(AuthGuard()) */
    async getAllUsers(): Promise<Users[]> {
        return this._userService.getAllUsers();
    }

    @Get('/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async getUserByID(
        @Param('id') id: string
    ): Promise<Users> {
        return this._userService.getUserById(id);
    }

    @Post()
    /* @ApiBearerAuth()
    @UseGuards(AuthGuard()) */
    async saveNewUser(
        @Body(ValidationPipe) userDto: CreateUserDto,
        @GetUser() user: Users
        ): Promise<void> {
        return this._userService.createNewUser(userDto, user);
    }

    @Delete('/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async deleteUser(@Param('id') id: string): Promise<void> {
        return this._userService.deleteUser(id);
    }

    @Post('/authenticate')
    async authenticateUser(
        @Body(ValidationPipe) userAuthDto: UserAuthDto,
        @Request() req: any,
        @Response() res: any,
        ): Promise<{accessToken: string}> {
            // console.log('req', req, res);
        return this._userService.authenticateUser(userAuthDto);
    }

    @Post('/verifyUser')
    async verifyUser(@Body('email') email: string) {
        return this._userService.verifyUser(email);
    }
    
    @Post('/verifyOTP')
    async verifyOTP(@Body('otp') otp: string, @Body('email') email: string) {
        return this._userService.verifyOTP(otp, email);
    }

}
