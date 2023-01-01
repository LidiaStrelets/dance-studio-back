import { ResponceDescription } from '@core/types';
import { throwUuidException } from '@core/util';
import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateMessageDto } from '@personalsModule/dto/create-message.dto';
import { Message } from '@personalsModule/models/messages.model';
import { MessagesService } from '@personalsModule/services/messages.service';

@ApiTags('Personals messages')
@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get user's personal class messages` })
  @ApiOkResponse({ type: [CreateMessageDto] })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @Get('/:personalId')
  public async getMessages(
    @Param(
      'personalId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    personalId: string,
  ): Promise<Message[]> {
    return await this.messagesService.get(personalId);
  }
}
