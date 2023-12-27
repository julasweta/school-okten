import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserReqDto } from './dto/req/create-user-req-dto';
import { CreateUserResType } from './dto/res/create-user-res-dto.';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create new user' })
  @Post('create')
  async createUser(@Body() body: CreateUserReqDto): Promise<CreateUserResType> {
    return this.usersService.createUser(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}
