import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { Users } from './entity/user.entity';
import { CreateUser } from './interface/create-user.interface';
import { LoginReqBody } from './interface/login-user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async create(reqBody: CreateUser) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: reqBody.email }, { username: reqBody.username }],
    });

    if (existingUser) {
      if (existingUser.email === reqBody.email) {
        throw new ConflictException('Email already exists');
      }
      if (existingUser.username === reqBody.username) {
        throw new ConflictException('Username already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(reqBody.password, 10);

    const user = this.userRepository.create({
      ...reqBody,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    const token = await this.generateToken({ sub: savedUser.id });

    return { ...savedUser, access_token: token };
  }

  async login(reqBody: LoginReqBody) {
    const existingUser = await this.userRepository.findOneBy({
      email: reqBody.email,
    });

    if (!existingUser) {
      throw new UnauthorizedException();
    }

    const isPasswordCorrect = await bcrypt.compare(
      reqBody.password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    const token = await this.generateToken({ sub: existingUser.id });

    const sanitizedUser = plainToInstance(Users, {
      ...existingUser,
      access_token: token,
    });

    return sanitizedUser;
  }

  async getUser(id: number) {
    const existingUser = await this.userRepository.findBy({ id });
    return existingUser;
  }

  async generateToken(payload: { sub: number }) {
    return await this.jwtService.signAsync(payload);
  }
}
