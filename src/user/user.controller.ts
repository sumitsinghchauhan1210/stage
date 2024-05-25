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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(':userId/list')
  async addToList(
    @Param('userId') userId: string,
    @Body('contentId') contentId: string,
    @Body('contentType') contentType: string,
  ) {
    return this.userService.addToList(userId, contentId, contentType);
  }

  @Delete(':userId/list/:contentId')
  async removeFromList(
    @Param('userId') userId: string,
    @Param('contentId') contentId: string,
  ) {
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
}
