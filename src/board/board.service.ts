import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GetAllBoardsResDTO } from './dto/res/getAllBoards.res.dto';
import { GetBoardDetailResDTO } from './dto/res/getBoardDetail.res.dto';
import { CreateBoardReqDTO } from './dto/req/createBoard.req.dto';
import { JwtPayload } from '../common/types/jwtPayload.types';
import { CreateBoardResDTO } from './dto/res/createBoard.res.dto';
import { UpdateBoardResDTO } from './dto/res/updateBoard.res.dto';
import { UpdateBoardReqDTO } from './dto/req/updateBoard.req.dto';

@Injectable()
export class BoardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllBoards(): Promise<GetAllBoardsResDTO[]> {
    const boards = await this.prismaService.board.findMany({
      select: {
        id: true,
        title: true,
        user: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return boards;
  }

  async getBoardDetail(boardId: string): Promise<GetBoardDetailResDTO> {
    const board = await this.prismaService.board.findUnique({
      where: {
        id: boardId,
      },
      select: {
        id: true,
        title: true,
        body: true,
        user: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!board)
      throw new NotFoundException('해당 ID의 게시글이 존재하지 않습니다.');
    return board;
  }

  async createBoard(
    user: JwtPayload,
    dto: CreateBoardReqDTO,
  ): Promise<CreateBoardResDTO> {
    const board = await this.prismaService.board.create({
      data: {
        title: dto.title,
        body: dto.body,
        userId: user.id,
      },
    });
    return board;
  }

  async updateBoard(
    boardId: string,
    user: JwtPayload,
    dto: UpdateBoardReqDTO,
  ): Promise<UpdateBoardResDTO> {
    const findBoard = await this.prismaService.board.findUnique({
      where: {
        id: boardId,
      },
    });

    if (!findBoard) {
      throw new NotFoundException('해당 ID의 게시글이 존재하지 않습니다.');
    }

    if (findBoard.userId !== user.id) {
      throw new ForbiddenException('해당 게시글의 수정 권한이 없습니다.');
    }

    const board = await this.prismaService.board.update({
      where: {
        id: boardId,
      },
      data: {
        title: dto.title,
        body: dto.body,
      },
    });

    return board;
  }
}
