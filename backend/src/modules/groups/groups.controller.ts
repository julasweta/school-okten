// groups.controller.ts
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupBaseDto } from './dto/group-base.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post('create')
  async createGroup(@Body() body: GroupBaseDto) {
    return await this.groupsService.createGroup(body);
  }

  @Get()
  async findAll() {
    return await this.groupsService.findGroups();
  }

  @Get(':id')
  async findOneGroup(@Param('id') id: string) {
    return await this.groupsService.findNameGroup(id);
  }

  @Delete('delete/:id')
  async removeGroup(@Param('id') id: string) {
    await this.groupsService.removeGroup(id);
    return { message: 'Group deleted successfully' };
  }
}
