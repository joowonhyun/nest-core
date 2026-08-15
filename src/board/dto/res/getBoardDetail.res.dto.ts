import { Expose, Type } from 'class-transformer';

export class User {
  @Expose() name: string;
}

export class GetBoardDetailResDTO {
  @Expose() id: string;
  @Expose() title: string;
  @Expose() body: string;
  @Expose() @Type(() => User) user: User;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}
