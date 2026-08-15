import { Expose, Type } from 'class-transformer';
import { User } from './getBoardDetail.res.dto';

export class GetAllBoardsResDTO {
  @Expose() id: string;
  @Expose() title: string;
  @Expose() @Type(() => User) user: User;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}
