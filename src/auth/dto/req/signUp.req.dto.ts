import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpReqDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  name: string;
}
