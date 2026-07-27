import { JwtService } from '@nestjs/jwt';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SignUpReqDTO } from './dto/req/signUp.req.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpReqDTO) {
    //이메일 중복확인
    const existedUser = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existedUser) {
      throw new ConflictException('중복된 메일 주소입니다.');
    }

    //비밀번호 해싱
    const hashedPassword = await this.hashData(dto.password);

    //유저 생성
    const newUser = await this.prismaService.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
      select: {
        email: true,
        name: true,
      },
    });

    return newUser;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
}
