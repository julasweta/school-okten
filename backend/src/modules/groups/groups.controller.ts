// groups.controller.ts
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupBaseDto } from './dto/group-base.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOperation({ summary: 'Create message' })
  @Post('create')
  async createGroup(@Body() body: GroupBaseDto) {
    return await this.groupsService.createGroup(body);
  }

  @ApiOperation({ summary: 'Get All messages' })
  @Get()
  async findAll() {
    return await this.groupsService.findGroups();
  }

  @ApiOperation({ summary: 'Get message by Id' })
  @Get(':id')
  async findOneGroup(@Param('id') id: string) {
    return await this.groupsService.findNameGroup(id);
  }

  @ApiOperation({ summary: 'Delete message by Id' })
  @Delete('delete/:id')
  async removeGroup(@Param('id') id: string) {
    await this.groupsService.removeGroup(id);
    return { message: 'Group deleted successfully' };
  }
}
