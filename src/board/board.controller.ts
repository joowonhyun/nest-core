import { Public } from '../common/decorators/public.decorator';
import { BoardService } from './board.service';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GetAllBoardsResDTO } from './dto/res/getAllBoards.res.dto';
import { JwtPayload } from '../common/types/jwtPayload.types';
import { CreateBoardReqDTO } from './dto/req/createBoard.req.dto';
import { User } from '../common/decorators/user.decorator';
import { CreateBoardResDTO } from './dto/res/createBoard.res.dto';
import { UpdateBoardReqDTO } from './dto/req/updateBoard.req.dto';
import { UpdateBoardResDTO } from './dto/res/updateBoard.res.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // 게시판 리스트 불러오는 API
  @Public()
  @Get('/all')
  getAllBoards(): Promise<GetAllBoardsResDTO[]> {
    return this.boardService.getAllBoards();
  }

  // 게시판 상세보기
  @Public()
  @Get('/:boardId')
  getBoardDetail(
    @Param('boardId') boardId: string,
  ): Promise<GetAllBoardsResDTO> {
    return this.boardService.getBoardDetail(boardId);
  }

  // 게시판 생성
  @Post()
  createBoard(
    @User() user: JwtPayload,
    @Body() dto: CreateBoardReqDTO,
  ): Promise<CreateBoardResDTO> {
    return this.boardService.createBoard(user, dto);
  }

  // 게시판 수정
  @Patch('/:boardId')
  updateBoard(
    @Param('boardId') boardId: string,
    @User() user: JwtPayload,
    @Body() dto: UpdateBoardReqDTO,
  ): Promise<UpdateBoardResDTO> {
    return this.boardService.updateBoard(boardId, user, dto);
  }
}
