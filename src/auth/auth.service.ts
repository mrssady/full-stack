import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { hash, compare } from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly Prisma: PrismaClient,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerDto: RegisterDto) {
    let user = await this.Prisma.user.findUnique({
      where: { email: registerDto.email },
    });
    if (user) {
      throw new BadRequestException('this email has already been taken.');
    }
    user = await this.Prisma.user.findUnique({
      where: { mobile: registerDto.mobile },
    });
    if (user) {
      throw new BadRequestException(
        'This mobile number has already been taken',
      );
    }
    registerDto.password = await hash(registerDto.password, 10);
    user = await this.Prisma.user.create({ data: registerDto });
    const token = await this.jwtService.signAsync(user);
    return { token };
  }

  async login(loginDto: LoginDto) {
    console.log(loginDto);
    const user = await this.Prisma.user.findFirst({
      where: {
        OR: [
          {
            email: loginDto.username,
          },
          {
            mobile: loginDto.username,
          },
        ],
      },
    });
    console.log(user);
    if (!user) {
      throw new NotFoundException(`user ${loginDto.username}not found`);
    }
    if (!(await compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.jwtService.signAsync(user);
    return { token };
  }
}
