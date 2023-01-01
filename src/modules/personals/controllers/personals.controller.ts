import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
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
import {
  IPersonalResponce,
  PersonalFullResponce,
} from '@personalsModule/types/types';
import { throwUuidException } from '@core/util';
import { UpdatePersonalDto } from '@personalsModule/dto/update.dto';
import { UpdateErrorService } from '@services/updateError/update-error.service';

@ApiTags('Personals')
@Controller('personals')
export class PersonalsController {
  constructor(
    private personalsService: PersonalsService,
    private updateErrorService: UpdateErrorService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to the personals' })
  @ApiOkResponse({ type: CreatePersonalDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBadRequestResponse({
    description: ResponceDescription.personalsBadRequest,
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
  @ApiOperation({ summary: 'Update personal class' })
  @ApiOkResponse({ type: CreatePersonalDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBadRequestResponse({
    description: `${ResponceDescription.personalsBadRequest}; ${ResponceDescription.updateError}`,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.notCoachRoute })
  @Patch('/:id')
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
  @ApiOkResponse({ type: [CreatePersonalDto] })
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
  ): Promise<PersonalFullResponce[]> {
    const personals = await this.personalsService.getActual(userId);
    return this.personalsService.mapPersonalToResponce(personals);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get personals by coach and date` })
  @ApiOkResponse({ type: [CreatePersonalDto] })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({
    description: `${ResponceDescription.notClientRoute}; ${ResponceDescription.personalsForbidden}`,
  })
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
  ): Promise<PersonalFullResponce[]> {
    const personals = await this.personalsService.getByDate(coachId, date);
    return this.personalsService.mapPersonalToResponce(personals);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get personals by id` })
  @ApiOkResponse({ type: [CreatePersonalDto] })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @Get('byId/:id')
  public async getById(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    id: string,
  ): Promise<PersonalFullResponce[]> {
    const personal = await this.personalsService.getById(id);

    return this.personalsService.mapPersonalToResponce([personal]);
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
