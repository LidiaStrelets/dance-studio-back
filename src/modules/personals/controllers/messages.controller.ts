import { ResponceDescription } from '@core/types';
import { throwUuidException } from '@core/util';
import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateMessageDto } from '@personalsModule/dto/create-message.dto';
import { Message } from '@personalsModule/models/messages.model';
import { MessagesService } from '@personalsModule/services/messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get user's personal class messages` })
  @ApiOkResponse({ type: CreateMessageDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @Get('/:id')
  public async getMessages(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    id: string,
  ): Promise<Message[]> {
    return await this.messagesService.get(id);
  }
}
