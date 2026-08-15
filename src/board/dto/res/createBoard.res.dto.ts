import { Expose } from 'class-transformer';

export class CreateBoardResDTO {
  @Expose() id: string;
  @Expose() title: string;
  @Expose() body: string;
  @Expose() userId: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}
