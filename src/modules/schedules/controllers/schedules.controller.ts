import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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
import { HallsService } from '@hallsModule/services/halls.service';
import { CreateScheduleDto } from '@schedulesModule/dto/create.dto';
import { UpdateScheduleDto } from '@schedulesModule/dto/update.dto';
import { SchedulesService } from '@schedulesModule/services/schedules.service';
import { Schedule } from '@schedulesModule/models/schedules.model';
import { IScheduleResponce } from '@schedulesModule/types/types';
import { ResponceDescription, UpdateResponce } from '@core/types';
import { Roles as RolesEnum } from '@core/types';
import { throwUuidException } from '@core/util';
import { ClassesService } from '@classesModule/services/classes.service';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(
    private scheduleService: SchedulesService,
    private hallsService: HallsService,
    private classesService: ClassesService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to the schedule' })
  @ApiOkResponse({ type: CreateScheduleDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.adminRoute })
  @Roles(RolesEnum.admin)
  @Post()
  public async add(@Body() dto: CreateScheduleDto): Promise<IScheduleResponce> {
    const coachClasses = await this.classesService.getByCoach(dto.coach);

    if (!coachClasses || coachClasses.length < 1) {
      throw new HttpException(
        `Requested class not found!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const availablePoles = await this.hallsService.getPolesAmount(dto.hall);

    const newItem = await this.scheduleService.create(dto, availablePoles);
    return this.mapScheduleToResponce(newItem);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update schedule' })
  @ApiOkResponse({ description: ResponceDescription.update })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.adminRoute })
  @ApiBadRequestResponse({ description: ResponceDescription.uuidException })
  @Roles(RolesEnum.admin)
  @Patch('/:id')
  public async update(
    @Body() scheduleDto: UpdateScheduleDto,
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    id: string,
  ): Promise<string> {
    const updatedSchedule = await this.scheduleService.update(scheduleDto, id);
    return updatedSchedule.length >= 1
      ? UpdateResponce.success
      : UpdateResponce.error;
  }

  private mapScheduleToResponce({
    coach,
    hall,
    class: class_id,
    date_time,
    places_left,
    id,
  }: Schedule): IScheduleResponce {
    return {
      coach,
      hall,
      class: class_id,
      date_time,
      places_left,
      id,
    };
  }
}
