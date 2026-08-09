import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { SignUpReqDTO } from './dto/req/signUp.req.dto';
import { SignInReqDTO } from './dto/req/signIn.req.dto';
import { TokenResDTO } from './dto/res/token.res.dto';
import { User } from '../common/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RtJwtPayload } from '../common/types/rtJwtPayload.types';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 1- 회원가입
  @ApiOperation({
    summary: '회원가입',
    description: '이메일과 비밀번호로 회원가입',
  })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
  })
  @ApiResponse({
    status: 409,
    description: '이메일 중복',
  })
  @Public()
  @Post('/signup')
  signUp(@Body() dto: SignUpReqDTO) {
    return this.authService.signUp(dto);
  }

  // 2- 로그인
  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호로 로그인',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: TokenResDTO,
  })
  @ApiResponse({
    status: 401,
    description: '비밀번호 오류',
  })
  @ApiResponse({
    status: 404,
    description: '해당 유저가 존재하지 않는 경우',
  })
  @Public()
  @Post('/signin')
  signIn(@Body() dto: SignInReqDTO): Promise<TokenResDTO> {
    return this.authService.signIn(dto);
  }

  // 3- 로그아웃
  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃',
  })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
  })
  @ApiResponse({
    status: 401,
    description: '토큰만료',
  })
  @ApiBearerAuth('accessToken')
  @Post('/logout')
  logout(@User('id') userId: string) {
    return this.authService.logout(userId);
  }

  // 4- 토큰 재발급 API
  @ApiOperation({
    summary: '엑세스 토큰 재발급',
  })
  @ApiResponse({
    status: 200,
    description: '토큰 재발급 성공',
    type: TokenResDTO,
  })
  @ApiResponse({
    status: 403,
    description: '토큰 불일치',
  })
  @ApiResponse({
    status: 404,
    description: '해당 유저가 존재하지 않습니다.',
  })
  @ApiBearerAuth('refreshToken')
  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh')
  refreshAccessToken(@User() user: RtJwtPayload) {
    return this.authService.refreshAccessToken(user);
  }
}
