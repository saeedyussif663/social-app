import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  create(@Body() createUserBody: CreateUserDto) {
    return this.usersService.create(createUserBody);
  }

  @Post('signin')
  login(@Body() loginBody: LoginUserDto) {
    return this.usersService.login(loginBody);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getUser(@Req() req: Request) {
    if (req.user?.sub) {
      return this.usersService.getUser(req.user?.sub);
    }
  }
}
