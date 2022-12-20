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
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateNotesDto } from '@personalsModule/dto/create-notes.dto';
import { Notes } from '@personalsModule/models/notes.model';
import { NotesService } from '@personalsModule/services/notes.service';
import { UpdateErrorService } from '@services/updateError/update-error.service';

@Controller('notes')
export class NotesController {
  constructor(
    private notesService: NotesService,
    private updateErrorService: UpdateErrorService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to the notes' })
  @ApiOkResponse({ type: CreateNotesDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @Post()
  public async create(@Body() dto: CreateNotesDto) {
    return await this.notesService.create(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get user's class notes` })
  @ApiOkResponse({ type: CreateNotesDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @Get('/:id')
  public async get(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    id: string,
  ): Promise<Notes> {
    return await this.notesService.get(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get user's class notes` })
  @ApiOkResponse({ type: CreateNotesDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
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
