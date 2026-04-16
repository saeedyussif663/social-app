import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user account' })
  @ApiBody({ type: CreateUserDto })
  @Post('signup')
  create(@Body() createUserBody: CreateUserDto) {
    return this.usersService.create(createUserBody);
  }

  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiBody({ type: LoginUserDto })
  @Post('signin')
  login(@Body() loginBody: LoginUserDto) {
    return this.usersService.login(loginBody);
  }

  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('me')
  getUser(@Req() req: Request) {
    if (req.user?.sub) {
      return this.usersService.getUser(req.user?.sub);
    }
  }
}
