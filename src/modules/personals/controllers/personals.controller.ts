import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { ResponceDescription } from '@core/types';
import { Roles as RolesEnum } from '@core/types';
import { RolesGuard } from '@guards/roles.guard';
import { PersonalsService } from '@personalsModule/services/personals.service';
import { CreatePersonalDto } from '@personalsModule/dto/create.dto';
import { Personal } from '@personalsModule/models/personals.model';
import { IPersonalResponce } from '@personalsModule/types/types';
import { throwUuidException } from '@core/util';
import { UpdatePersonalDto } from '@personalsModule/dto/update.dto';
import { UpdateErrorService } from '@services/updateError/update-error.service';
import { Message } from '@personalsModule/models/messages.model';
import { MessagesService } from '@personalsModule/services/messages.service';

@ApiTags('Personals')
@Controller('personals')
export class PersonalsController {
  constructor(
    private personalsService: PersonalsService,
    private updateErrorService: UpdateErrorService,
    private messagesService: MessagesService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to the personals' })
  @ApiOkResponse({ type: CreatePersonalDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.notCoachRoute })
  @Roles(RolesEnum.admin, RolesEnum.client)
  @UseGuards(RolesGuard)
  @Post('/:userId')
  public async add(
    @Body() dto: CreatePersonalDto,
    @Param(
      'userId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    userId: string,
  ): Promise<IPersonalResponce> {
    const personal = await this.personalsService.create(dto, userId);
    return this.mapPersonalToResponce(personal);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to the personals' })
  @ApiOkResponse({ type: CreatePersonalDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.notCoachRoute })
  @Post('/update/:id')
  public async update(
    @Body() dto: UpdatePersonalDto,
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    id: string,
  ) {
    const [count, items] = await this.personalsService.update(dto, id);

    this.updateErrorService.throwError(count);

    return this.mapPersonalToResponce(items[0]);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get user's personals` })
  @ApiOkResponse({ type: CreatePersonalDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.notCoachRoute })
  @Roles(RolesEnum.admin, RolesEnum.client)
  @UseGuards(RolesGuard)
  @Get('/:userId')
  public async getByUser(
    @Param(
      'userId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    userId: string,
  ): Promise<IPersonalResponce[]> {
    const personals = await this.personalsService.getActual(userId);
    return personals.map((item) => this.mapPersonalToResponce(item));
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get user's personals` })
  @ApiOkResponse({ type: CreatePersonalDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.notCoachRoute })
  @Roles(RolesEnum.admin, RolesEnum.coach)
  @UseGuards(RolesGuard)
  @Get('byCoach/:coachId/:date')
  public async getByCoach(
    @Param(
      'coachId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    coachId: string,
    @Param('date')
    date: string,
  ): Promise<IPersonalResponce[]> {
    const personals = await this.personalsService.getByDate(coachId, date);
    return personals.map((item) => this.mapPersonalToResponce(item));
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get user's personals` })
  @ApiOkResponse({ type: CreatePersonalDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.notCoachRoute })
  @Get('/messages/:id')
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

  private mapPersonalToResponce({
    coach_id,
    hall_id,
    class_id,
    date_time,
    id,
    duration,
    status,
    client_id,
  }: Personal): IPersonalResponce {
    return {
      coach_id,
      hall_id,
      class_id,
      date_time,
      id,
      duration,
      status,
      client_id,
    };
  }
}
