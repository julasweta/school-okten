import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessageBaseDto } from './dto/create-message.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Mesagges')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({ summary: 'create new message' })
  @Post()
  async createMessage(
    @Body() body: MessageBaseDto,
    @Headers('authorization') accessToken: string,
  ) {
    return await this.messagesService.createMessage(body, accessToken);
  }

  @ApiOperation({ summary: 'Get all messages' })
  @Get('all')
  findAll() {
    return this.messagesService.findAll();
  }

  @ApiOperation({ summary: 'Get one message' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @ApiOperation({ summary: 'Delete one message' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
