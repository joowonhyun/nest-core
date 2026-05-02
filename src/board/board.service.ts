import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardService {
  boards = [
    {
      id: 1,
      title: '게시글1',
    },
    {
      id: 2,
      title: '게시글2',
    },
  ];

  getAllBoards() {
    return this.boards;
  }
}
