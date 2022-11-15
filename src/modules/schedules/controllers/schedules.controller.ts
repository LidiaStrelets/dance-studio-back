import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
import { CreateScheduleDto } from '@schedulesModule/dto/create.dto';
import { UpdateScheduleDto } from '@schedulesModule/dto/update.dto';
import { SchedulesService } from '@schedulesModule/services/schedules.service';
import { Schedule } from '@schedulesModule/models/schedules.model';
import { FullResponce, IScheduleResponce } from '@schedulesModule/types/types';
import { ResponceDescription, UpdateResponce } from '@core/types';
import { Roles as RolesEnum } from '@core/types';
import { throwUuidException } from '@core/util';
import { RegistrationsService } from '@registrationsModule/services/registrations.service';
import { RolesGuard } from '@guards/roles.guard';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(
    private scheduleService: SchedulesService,
    private registrationsService: RegistrationsService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to the schedule' })
  @ApiOkResponse({ type: CreateScheduleDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.adminRoute })
  @Roles(RolesEnum.admin)
  @UseGuards(RolesGuard)
  @Post()
  public async add(@Body() dto: CreateScheduleDto): Promise<any> {
    const itemsWithDifferentDuration = await this.scheduleService.getByDuration(
      dto.date_time.toISOString(),
    );
    if (itemsWithDifferentDuration.length > 0) {
      itemsWithDifferentDuration.forEach((item) => {
        if (item.date_time < new Date(dto.date_time)) {
          if (
            new Date(
              item.date_time.getTime() +
                this.scheduleService.minToMs(item.duration),
            ) > new Date(dto.date_time)
          ) {
            this.scheduleService.throwSameTimeException();
          }
        }
      });
    }

    const itemsSameTime = await this.scheduleService.checkSameTime(dto);
    if (itemsSameTime.length > 0) {
      this.scheduleService.throwSameTimeException();
    }

    const newItem = await this.scheduleService.create(dto);
    return this.mapScheduleToResponce(newItem);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to the schedule' })
  @ApiOkResponse({ type: CreateScheduleDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.adminRoute })
  @Roles(RolesEnum.admin)
  @UseGuards(RolesGuard)
  @Post('copyDay')
  public async copyDay(
    @Body() dto: { dateExisting: string; dateTarget: string },
  ): Promise<any> {
    const itemsSameDate = await this.scheduleService.getByDate(
      dto.dateExisting,
    );
    try {
      await Promise.all(
        itemsSameDate.map((item) =>
          this.scheduleService.create({
            ...item.get(),
            date_time: new Date(
              dto.dateTarget.split('T')[0] +
                'T' +
                item.date_time.toISOString().split('T')[1],
            ),
          }),
        ),
      );
      return 'success';
    } catch {
      throw new HttpException(
        [
          {
            message: ['something went wrong'],
          },
        ],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update schedule' })
  @ApiOkResponse({ description: ResponceDescription.update })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBadRequestResponse({ description: ResponceDescription.uuidException })
  @ApiForbiddenResponse({ description: ResponceDescription.adminRoute })
  @Roles(RolesEnum.admin)
  @UseGuards(RolesGuard)
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update schedule' })
  @ApiOkResponse({ description: ResponceDescription.update })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @Get('schedule/:id')
  public async getById(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    id: string,
  ): Promise<FullResponce> {
    const schedule = await this.scheduleService.getById(id);

    return this.scheduleService.mapScheduleToResponce(schedule);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update schedule' })
  @ApiOkResponse({ description: ResponceDescription.update })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @Get('/:date')
  public async get(@Param('date') date: string): Promise<FullResponce[]> {
    const schedules = await this.scheduleService.getByDate(date);

    return this.scheduleService.mapSchedulesToResponce(schedules);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update schedule' })
  @ApiOkResponse({ description: ResponceDescription.update })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @Get('week/:dateFrom/:dateTo')
  public async getForPeriod(
    @Param('dateFrom') dateFrom: string,
    @Param('dateTo') dateTo: string,
  ): Promise<FullResponce[]> {
    const schedules = await this.scheduleService.getForPeriod(dateFrom, dateTo);

    return this.scheduleService.mapSchedulesToResponce(schedules);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update schedule' })
  @ApiOkResponse({ description: ResponceDescription.update })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @Get('/enrolled/:userId/:date')
  public async getEnrolled(
    @Param('date') date: string,
    @Param(
      'userId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    userId: string,
  ): Promise<FullResponce[]> {
    const schedules = await this.scheduleService.getByDate(date);
    const registrations = await this.registrationsService.getByUserAndDate(
      userId,
      schedules.map(({ id }) => id),
    );

    return this.scheduleService.mapSchedulesToResponce(
      schedules.filter((schedule) =>
        registrations.some(
          (registration) =>
            registration.schedule_id === schedule.id &&
            registration.client_id === userId,
        ),
      ),
    );
  }

  private mapScheduleToResponce({
    coach_id,
    hall_id,
    class_id,
    date_time,
    id,
    duration,
  }: Schedule): IScheduleResponce {
    return {
      coach_id,
      hall_id,
      class_id,
      date_time,
      id,
      duration,
    };
  }
}
