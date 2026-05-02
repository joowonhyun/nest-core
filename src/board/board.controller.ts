import { BoardService } from './board.service';
import { Controller, Get } from '@nestjs/common';

@Controller('board')
export class BoardController {
  constructor(private readonly BoardService: BoardService) {}

  @Get('/all')
  getAllBoards() {
    return this.BoardService.getAllBoards();
  }
}
