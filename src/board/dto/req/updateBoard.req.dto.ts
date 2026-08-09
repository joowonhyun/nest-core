import { IsOptional, IsString } from 'class-validator';

export class UpdateBoardReqDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;
}
