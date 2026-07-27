import { Public } from '../common/decorators/pubilc.decorator';
import { AuthService } from './auth.service';
import { Controller, Body, Post } from '@nestjs/common';
import { SignUpReqDTO } from './dto/req/signUp.req.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 1- 회원가입
  @Public()
  @Post('/signup')
  signUp(@Body() dto: SignUpReqDTO) {
    return this.authService.signUp(dto);
  }
}
