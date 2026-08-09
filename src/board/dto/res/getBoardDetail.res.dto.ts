export class User {
  name: string;
}

export class GetBoardDetailResDTO {
  id: string;
  title: string;
  body: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
