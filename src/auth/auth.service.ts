import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SignUpReqDTO } from './dto/req/signUp.req.dto';
import * as bcrypt from 'bcrypt';
import { SignInReqDTO } from './dto/req/signIn.req.dto';
import { TokenResDTO } from './dto/res/token.res.dto';
import { JwtPayload } from '../common/types/jwtPayload.types';
import { RtJwtPayload } from '../common/types/rtJwtPayload.types';

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

  async signIn(dto: SignInReqDTO): Promise<TokenResDTO> {
    // 이메일 유저 확인
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    }

    // 비밀번호 일치 여부 확인

    const comparePassword = await bcrypt.compare(dto.password, user.password);

    if (!comparePassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    // 토큰 발급
    const tokens = await this.getUserTokens(user.id, user.email, user.name);
    //RT 해쉬 업데이트 (hashedRt 저장) 구현 필요
    const hashedRt = await this.hashData(tokens.refreshToken);

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashedRt: hashedRt,
      },
    });

    return tokens;
  }

  async getUserTokens(userId: string, email: string, name: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          email: email,
          name: name,
        },
        {
          secret: process.env.AT_SECRET,
          expiresIn: 60 * 15, // 15분 유효
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          email: email,
          name: name,
        },
        {
          secret: process.env.RT_SECRET,
          expiresIn: 60 * 60 * 24 * 7, // 일주일 유효
        },
      ),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async logout(user: JwtPayload) {
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async refreshAccessToken(user: RtJwtPayload) {
    //user.id 유저 존재하는지 확인
    const existedUser = await this.prismaService.user.findUnique({
      where: {
        id: user.payload.id,
        hashedRt: {
          not: null,
        },
      },
    });

    if (!existedUser) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    //refresh 유효한지 체크
    const rtMatches = await bcrypt.compare(
      user.refreshToken,
      existedUser.hashedRt ?? '',
    );
    if (!rtMatches) {
      throw new ForbiddenException();
    }

    //토큰 재발급
    const tokens = await this.getUserTokens(
      existedUser.id,
      existedUser.email,
      existedUser.name,
    );

    //해쉬 RT 업데이트
    const hashedRt = await this.hashData(tokens.refreshToken);
    await this.prismaService.user.update({
      where: {
        id: existedUser.id,
      },
      data: {
        hashedRt: hashedRt,
      },
    });

    //토큰 리턴
    return tokens;
  }
}
