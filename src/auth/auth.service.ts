import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    let user = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (user) {
      throw new BadRequestException('this email has already as been taken.');
    }

    user = await this.prisma.user.findUnique({
      where: { mobile: registerDto.mobile },
    });

    if (user) {
      throw new BadRequestException(
        'this mobole number has been arleady taken',
      );
    }
    registerDto.password = await hash(registerDto.password, 10);
    user = await this.prisma.user.create({ data: registerDto });
    const token = await this.jwtService.signAsync(user);
    return { token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
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

    if (!user) {
      throw new NotFoundException(`user ${loginDto.username} not found`);
    }

    if (!(await compare(loginDto.password, user.password))) {
      throw new UnauthorizedException(`invalid credentails`);
    }

    const tokan = await this.jwtService.signAsync(user);
    return { tokan };
  }
}
