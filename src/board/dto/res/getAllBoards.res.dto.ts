import { User } from './getBoardDetail.res.dto';

export class GetAllBoardsResDTO {
  id: string;
  title: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
