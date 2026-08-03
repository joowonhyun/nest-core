import { IsEmail, IsString } from 'class-validator';

export class SignInReqDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
