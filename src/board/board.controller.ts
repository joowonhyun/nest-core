import { Public } from '../common/decorators/public.decorator';
import { BoardService } from './board.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GetAllBoardsResDTO } from './dto/res/getAllBoards.res.dto';
import { GetBoardDetailResDTO } from './dto/res/getBoardDetail.res.dto';
import { JwtPayload } from '../common/types/jwtPayload.types';
import { CreateBoardReqDTO } from './dto/req/createBoard.req.dto';
import { User } from '../common/decorators/user.decorator';
import { CreateBoardResDTO } from './dto/res/createBoard.res.dto';
import { UpdateBoardReqDTO } from './dto/req/updateBoard.req.dto';
import { UpdateBoardResDTO } from './dto/res/updateBoard.res.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // 게시판 리스트 불러오는 API
  @ApiOperation({ summary: '게시판 리스트 조회' })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: [GetAllBoardsResDTO],
  })
  @Public()
  @Get('/all')
  getAllBoards(): Promise<GetAllBoardsResDTO[]> {
    return this.boardService.getAllBoards();
  }

  // 게시판 상세보기
  @ApiOperation({ summary: '게시판 상세 조회' })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: GetBoardDetailResDTO,
  })
  @ApiResponse({
    status: 404,
    description: '해당 ID의 게시글이 존재하지 않는 경우',
  })
  @Public()
  @Get('/:boardId')
  getBoardDetail(
    @Param('boardId') boardId: string,
  ): Promise<GetBoardDetailResDTO> {
    return this.boardService.getBoardDetail(boardId);
  }

  // 게시판 생성
  @ApiOperation({ summary: '게시판 생성' })
  @ApiResponse({
    status: 201,
    description: '생성 성공',
    type: CreateBoardResDTO,
  })
  @ApiBearerAuth('accessToken')
  @Post()
  createBoard(
    @User() user: JwtPayload,
    @Body() dto: CreateBoardReqDTO,
  ): Promise<CreateBoardResDTO> {
    return this.boardService.createBoard(user, dto);
  }

  // 게시판 수정
  @ApiOperation({ summary: '게시판 수정' })
  @ApiResponse({
    status: 200,
    description: '수정 성공',
    type: UpdateBoardResDTO,
  })
  @ApiResponse({
    status: 403,
    description: '해당 게시글의 수정 권한이 없는 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 ID의 게시글이 존재하지 않는 경우',
  })
  @ApiBearerAuth('accessToken')
  @Patch('/:boardId')
  updateBoard(
    @Param('boardId') boardId: string,
    @User() user: JwtPayload,
    @Body() dto: UpdateBoardReqDTO,
  ): Promise<UpdateBoardResDTO> {
    return this.boardService.updateBoard(boardId, user, dto);
  }

  // 게시판 삭제
  @ApiOperation({ summary: '게시판 삭제' })
  @ApiResponse({
    status: 200,
    description: '삭제 성공',
  })
  @ApiResponse({
    status: 403,
    description: '해당 게시글의 삭제 권한이 없는 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 ID의 게시글이 존재하지 않는 경우',
  })
  @ApiBearerAuth('accessToken')
  @HttpCode(200)
  @Delete('/:boardId')
  deleteBoard(
    @Param('boardId') boardId: string,
    @User() user: JwtPayload,
  ): Promise<void> {
    return this.boardService.deleteBoard(boardId, user);
  }
}
