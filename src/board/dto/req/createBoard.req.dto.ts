import { IsString } from 'class-validator';

export class CreateBoardReqDTO {
  @IsString()
  title: string;

  @IsString()
  body: string;
}
