import { CreateUserReqDTO } from './dto/createUser.req.dto';
import { UpdateUserReqDTO } from './dto/updateUser.req.dto';
import { UserService } from './user.service';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  createUser(@Body() dto: CreateUserReqDTO) {
    return this.userService.createUser(dto);
  }

  @Get('')
  getUser() {
    return this.userService.getUser();
  }

  @Get('/:userId')
  getUserDetail(@Param('userId') userId: string) {
    return this.userService.getUserDetail(userId);
  }

  @Patch()
  updateUser(@Body() dto: UpdateUserReqDTO) {
    return this.userService.updateUser(dto);
  }
}
