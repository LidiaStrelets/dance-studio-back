import { ResponceDescription } from '@core/types';
import { throwUuidException } from '@core/util';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateNotesDto } from '@personalsModule/dto/create-notes.dto';
import { Notes } from '@personalsModule/models/notes.model';
import { NotesService } from '@personalsModule/services/notes.service';
import { UpdateErrorService } from '@services/updateError/update-error.service';

@ApiTags('Personals notes')
@Controller('notes')
export class NotesController {
  constructor(
    private notesService: NotesService,
    private updateErrorService: UpdateErrorService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to personal class notes' })
  @ApiOkResponse({ type: CreateNotesDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @Post()
  public async create(@Body() dto: CreateNotesDto) {
    return await this.notesService.create(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get coach personal class notes` })
  @ApiOkResponse({ type: CreateNotesDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @Get('/:personalId')
  public async get(
    @Param(
      'personalId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    personalId: string,
  ): Promise<Notes> {
    return await this.notesService.get(personalId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Update user's class notes` })
  @ApiOkResponse({ type: CreateNotesDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBadRequestResponse({
    description: ResponceDescription.updateError,
  })
  @Patch('/:id')
  public async uodate(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    id: string,
    @Body() dto: CreateNotesDto,
  ): Promise<Notes> {
    const [updatedNumber, items] = await this.notesService.update(dto, id);

    this.updateErrorService.throwError(updatedNumber);

    return items[0];
  }
}
