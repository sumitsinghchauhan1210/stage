import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { AddToListDTO } from './dto/add-to-list.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(':userId/list')
  async addToList(
    @Param('userId') userId: string,
    @Body() addToListData: AddToListDTO,
  ) {
    return this.userService.addToList(
      userId,
      addToListData.contentId,
      addToListData.contentType,
    );
  }

  @Delete(':userId/list/:contentId')
  async removeFromList(
    @Param('userId') userId: string,
    @Param('contentId') contentId: string,
  ) {
    console.log({ userId, contentId });
    return this.userService.removeFromList(userId, contentId);
  }

  @Get(':userId/list')
  async listMyItems(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.listMyItems(userId, page, limit);
  }

  @Get('/')
  async listUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.listUsers(page, limit);
  }
}
