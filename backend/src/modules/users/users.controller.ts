import { Controller, Get, Body, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserResType } from './dto/res/create-user-res-dto.';
import { ActivateUserReqDto } from './dto/req/activate-user-dto';
import { UserBaseDto } from './dto/user.base.dto';
import { UserResponseMapper } from './dto/res/user-resp-mapper';
import { RoleDecorator } from '../../common/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from './interfaces/users.types';
import { RoleGuard } from '../../common/guards/role.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user ID' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CreateUserResType> {
    const user = await this.usersService.userFindOneId(id);
    return UserResponseMapper.toResUserMapper(user);
  }

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async getAllUsers(): Promise<CreateUserResType[]> {
    const users = await this.usersService.getAllUsers();
    return users;
  }

  //додати можливість тільки для адміна
  @RoleDecorator(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  @ApiOperation({ summary: 'Ban and UnBan user' })
  @Put('ban/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: ActivateUserReqDto,
  ): Promise<Partial<UserBaseDto>> {
    const user = await this.usersService.updateUser(id, body);
    return user;
  }
}
