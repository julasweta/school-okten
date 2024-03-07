import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleDecorator } from '../../common/decorators/role.decorator';
import { ActivateUserReqDto } from './dto/req/activate-user-dto';
import { CreateUserResType } from './dto/res/create-user-res-dto.';
import { UserResponseMapper } from './dto/res/user-resp-mapper';
import { UserBaseDto } from './dto/user.base.dto';
import { UserRole } from './interfaces/users.types';
import { UsersService } from './users.service';
import { ParamsQueryDto } from '../orders/dto/orders-params.dto';
import { IPaginationResponse } from '../orders/orders.repository';

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
  async getAllUsers(
    @Query() query: ParamsQueryDto,
  ): Promise<IPaginationResponse<Partial<UserBaseDto>>> {
    const users = await this.usersService.getAllUsers(query);
    return users;
  }

  //додати можливість тільки для адміна
  @RoleDecorator(UserRole.ADMIN)
  //@UseGuards(AuthGuard(), RoleGuard)
  @ApiOperation({ summary: 'Ban and UnBan user' })
  @Put('ban/:id')
  async banUser(
    @Param('id') id: string,
    @Body() body: ActivateUserReqDto,
  ): Promise<Partial<UserBaseDto>> {
    const user = await this.usersService.banUser(id, body);
    return user;
  }
}
