import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { SignUpReqDTO } from './dto/req/signUp.req.dto';
import { SignInReqDTO } from './dto/req/signIn.req.dto';
import { TokenResDTO } from './dto/res/token.res.dto';
import { User } from '../common/decorators/user.decorator';
import { JwtPayload } from '../common/types/jwtPayload.types';
import { AuthGuard } from '@nestjs/passport';
import { RtJwtPayload } from '../common/types/rtJwtPayload.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 1- 회원가입
  @Public()
  @Post('/signup')
  signUp(@Body() dto: SignUpReqDTO) {
    return this.authService.signUp(dto);
  }

  // 2- 로그인
  @Public()
  @Post('/signin')
  signIn(@Body() dto: SignInReqDTO): Promise<TokenResDTO> {
    return this.authService.signIn(dto);
  }

  // 3- 로그아웃
  @Post('/logout')
  logout(@User() user: JwtPayload) {
    return this.authService.logout(user);
  }

  // 4- 토큰 재발급 API
  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh')
  refreshAccessToken(@User() user: RtJwtPayload) {
    return this.authService.refreshAccessToken(user);
  }
}
