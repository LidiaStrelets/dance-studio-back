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
import {
  IScheduleResponce,
  TransformedSchedule,
} from '@schedulesModule/types/types';
import { ResponceDescription, UpdateResponce } from '@core/types';
import { Roles as RolesEnum } from '@core/types';
import { throwUuidException } from '@core/util';
import { UsersService } from '@usersModule/services/users.service';
import { HallsService } from '@hallsModule/services/halls.service';
import { ClassesService } from '@classesModule/services/classes.service';
import { RegistrationsService } from '@registrationsModule/services/registrations.service';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(
    private scheduleService: SchedulesService,
    private usersServise: UsersService,
    private hallService: HallsService,
    private classService: ClassesService,
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
  @Post()
  public async add(@Body() dto: CreateScheduleDto): Promise<any> {
    const itemsWithDifferentDuration = await this.scheduleService.getByDuration(
      dto.date_time,
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
            date_time:
              dto.dateTarget.split('T')[0] +
              'T' +
              item.date_time.toISOString().split('T')[1],
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update schedule' })
  @ApiOkResponse({ description: ResponceDescription.update })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @Get()
  public async get(@Body() date: Date): Promise<TransformedSchedule[]> {
    const coaches = await this.usersServise.getCoaches();
    const halls = await this.hallService.get();
    const classes = await this.classService.get();
    const schedules = await this.scheduleService.getByDate(date.toISOString());

    return schedules.map((item) => {
      const coach = coaches.find((coach) => coach.id === item.coach_id);
      return {
        ...item.get(),
        coach: coach.firstname + ' ' + coach.lastname,
        hall: halls.find((hall) => hall.id === item.hall_id).name,
        class: classes.find((class_item) => class_item.id === item.class_id)
          .name,
        hallUk: halls.find((hall) => hall.id === item.hall_id).nameUk,
        classUk: classes.find((class_item) => class_item.id === item.class_id)
          .nameUk,
        polesAmount: halls.find((hall) => hall.id === item.hall_id)
          .poles_amount,
      };
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update schedule' })
  @ApiOkResponse({ description: ResponceDescription.update })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @Get('/enrolled/:userId')
  public async getEnrolled(
    @Body() date: Date,
    @Param(
      'userId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    userId: string,
  ): Promise<TransformedSchedule[]> {
    const coaches = await this.usersServise.getCoaches();
    const halls = await this.hallService.get();
    const classes = await this.classService.get();
    const schedules = await this.scheduleService.getByDate(date.toISOString());
    const registrations = await this.registrationsService.getByUserAndDate(
      userId,
      schedules.map(({ id }) => id),
    );

    return schedules
      .filter((schedule) =>
        registrations.some(
          (registration) =>
            registration.schedule_id === schedule.id &&
            registration.client_id === userId,
        ),
      )
      .map((item) => {
        const coach = coaches.find((coach) => coach.id === item.coach_id);
        return {
          ...item.get(),
          coach: coach.firstname + ' ' + coach.lastname,
          hall: halls.find((hall) => hall.id === item.hall_id).name,
          class: classes.find((class_item) => class_item.id === item.class_id)
            .name,
          hallUk: halls.find((hall) => hall.id === item.hall_id).nameUk,
          classUk: classes.find((class_item) => class_item.id === item.class_id)
            .nameUk,
          polesAmount: halls.find((hall) => hall.id === item.hall_id)
            .poles_amount,
        };
      });
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
