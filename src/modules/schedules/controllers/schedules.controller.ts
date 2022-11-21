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
import { ResponceDescription } from '@core/types';
import { Roles as RolesEnum } from '@core/types';
import { throwUuidException } from '@core/util';
import { RegistrationsService } from '@registrationsModule/services/registrations.service';
import { RolesGuard } from '@guards/roles.guard';
import { PersonalsService } from '@personalsModule/services/personals.service';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(
    private scheduleService: SchedulesService,
    private registrationsService: RegistrationsService,
    private personalsService: PersonalsService,
  ) {}

  // until the admin functionality is done will keep this for creating schedules
  @Post('/createSchedules')
  public async createUsers() {
    console.log('create in controller');

    await this.scheduleService.create({
      id: '',
      coach_id: '18d839b2-102f-44be-a81a-1f5dbf5f0f84', //luba
      class_id: 'f75f42d4-e28a-400a-b2f2-472eac4b4865', //exot
      date_time: new Date('2022-11-02T20:00:00'),
      duration: 60,
      hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    });
    await this.scheduleService.create({
      id: '',
      coach_id: '18d839b2-102f-44be-a81a-1f5dbf5f0f84', //luba
      class_id: 'f75f42d4-e28a-400a-b2f2-472eac4b4865', //exot
      date_time: new Date('2022-11-04T20:00:00'),
      duration: 60,
      hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    });
    await this.scheduleService.create({
      id: '',
      coach_id: '18d839b2-102f-44be-a81a-1f5dbf5f0f84', //luba
      class_id: 'f75f42d4-e28a-400a-b2f2-472eac4b4865', //exot
      date_time: new Date('2022-11-07T20:00:00'),
      duration: 60,
      hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    });
    await this.scheduleService.create({
      id: '',
      coach_id: '18d839b2-102f-44be-a81a-1f5dbf5f0f84', //luba
      class_id: 'f75f42d4-e28a-400a-b2f2-472eac4b4865', //exot
      date_time: new Date('2022-11-09T20:00:00'),
      duration: 60,
      hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    });
    await this.scheduleService.create({
      id: '',
      coach_id: '18d839b2-102f-44be-a81a-1f5dbf5f0f84', //luba
      class_id: 'f75f42d4-e28a-400a-b2f2-472eac4b4865', //exot
      date_time: new Date('2022-11-11T20:00:00'),
      duration: 60,
      hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    });

    await this.scheduleService.create({
      id: '',
      coach_id: '18d839b2-102f-44be-a81a-1f5dbf5f0f84', //luba
      class_id: 'f75f42d4-e28a-400a-b2f2-472eac4b4865', //exot
      date_time: new Date('2022-11-14T20:00:00'),
      duration: 60,
      hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    });
    await this.scheduleService.create({
      id: '',
      coach_id: '18d839b2-102f-44be-a81a-1f5dbf5f0f84', //luba
      class_id: 'f75f42d4-e28a-400a-b2f2-472eac4b4865', //exot
      date_time: new Date('2022-11-16T20:00:00'),
      duration: 60,
      hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    });
    await this.scheduleService.create({
      id: '',
      coach_id: '18d839b2-102f-44be-a81a-1f5dbf5f0f84', //luba
      class_id: 'f75f42d4-e28a-400a-b2f2-472eac4b4865', //exot
      date_time: new Date('2022-11-18T20:00:00'),
      duration: 60,
      hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    });
    // await this.scheduleService.create({
    //   id: '',
    //   coach_id: '18d839b2-102f-44be-a81a-1f5dbf5f0f84', //luba
    //   class_id: 'f75f42d4-e28a-400a-b2f2-472eac4b4865', //exot
    //   date_time: new Date('2022-10-18T19:00:00'),
    //   duration: 60,
    //   hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    // });
    // await this.scheduleService.create({
    //   id: '',
    //   coach_id: '18d839b2-102f-44be-a81a-1f5dbf5f0f84', //luba
    //   class_id: 'f75f42d4-e28a-400a-b2f2-472eac4b4865', //exot
    //   date_time: new Date('2022-10-18T20:00:00'),
    //   duration: 60,
    //   hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    // });

    // await this.scheduleService.create({
    //   id: '',
    //   coach_id: '18d839b2-102f-44be-a81a-1f5dbf5f0f84', //luba
    //   class_id: 'f75f42d4-e28a-400a-b2f2-472eac4b4865', //exot
    //   date_time: new Date('2022-11-19T09:00:00'),
    //   duration: 60,
    //   hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    // });
    // await this.scheduleService.create({
    //   id: '',
    //   coach_id: 'b4361154-3b92-43ac-bae1-10450ea7189c', //tania
    //   class_id: 'f75f42d4-e28a-400a-b2f2-472eac4b4865', //exot
    //   date_time: new Date('2022-11-19T10:00:00'),
    //   duration: 60,
    //   hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    // });
    // await this.scheduleService.create({
    //   id: '',
    //   coach_id: 'b4361154-3b92-43ac-bae1-10450ea7189c', //tania
    //   class_id: 'fe5f1fff-bbd8-4675-8a5f-52eac3f42b88', //sport
    //   date_time: new Date('2022-11-19T11:00:00'),
    //   duration: 60,
    //   hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    // });
    // await this.scheduleService.create({
    //   id: '',
    //   coach_id: '911fe288-b387-4c62-9878-812457abb156', //sasha
    //   class_id: '88f7bf82-ea7e-4172-bd3e-1ad5c4b718dd', //beg
    //   date_time: new Date('2022-11-19T17:00:00'),
    //   duration: 60,
    //   hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    // });
    // await this.scheduleService.create({
    //   id: '',
    //   coach_id: '911fe288-b387-4c62-9878-812457abb156', //sasha
    //   class_id: 'fe5f1fff-bbd8-4675-8a5f-52eac3f42b88', //sport
    //   date_time: new Date('2022-11-19T18:00:00'),
    //   duration: 60,
    //   hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    // });

    // await this.scheduleService.create({
    //   id: '',
    //   coach_id: 'd36e54fe-a82f-4bbc-a505-3a6f2a20277f', //vira
    //   class_id: '16c0c2dd-e139-4544-b312-4fdd934d68ee', //plastic
    //   date_time: new Date('2022-11-20T12:00:00'),
    //   duration: 60,
    //   hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    // });
    // await this.scheduleService.create({
    //   id: '',
    //   coach_id: 'd36e54fe-a82f-4bbc-a505-3a6f2a20277f', //vira
    //   class_id: 'b678755c-20fa-405a-bff6-ad7cbb6ec53f', //stretch
    //   date_time: new Date('2022-11-20T13:00:00'),
    //   duration: 60,
    //   hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    // });
    // await this.scheduleService.create({
    //   id: '',
    //   coach_id: 'b4361154-3b92-43ac-bae1-10450ea7189c', //tania
    //   class_id: 'fe5f1fff-bbd8-4675-8a5f-52eac3f42b88', //sport
    //   date_time: new Date('2022-11-20T18:00:00'),
    //   duration: 60,
    //   hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    // });
    // await this.scheduleService.create({
    //   id: '',
    //   coach_id: '18d839b2-102f-44be-a81a-1f5dbf5f0f84', //luba
    //   class_id: 'f75f42d4-e28a-400a-b2f2-472eac4b4865', //exot
    //   date_time: new Date('2022-11-20T19:00:00'),
    //   duration: 60,
    //   hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    // });
    // await this.scheduleService.create({
    //   id: '',
    //   coach_id: '18d839b2-102f-44be-a81a-1f5dbf5f0f84', //luba
    //   class_id: 'f75f42d4-e28a-400a-b2f2-472eac4b4865', //exot
    //   date_time: new Date('2022-11-20T20:00:00'),
    //   duration: 60,
    //   hall_id: '7f59792b-ee8a-4ff2-af7e-0c45c4c0391e',
    // });
  }

  @ApiOperation({
    summary: 'Get data about one user - allowed to data owner or admin',
  })
  @ApiBearerAuth()
  // @ApiOkResponse({ type: RegisterDto }) edit this
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.notClientRoute })
  @ApiBadRequestResponse({ description: ResponceDescription.uuidException })
  @Roles(RolesEnum.admin, RolesEnum.coach)
  @UseGuards(RolesGuard)
  @Get('salary/:coachId')
  public async getSalary(
    @Param(
      'coachId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    coachId: string,
  ): Promise<number> {
    const schedules = await this.scheduleService.getByCurrentMonth(coachId);
    const personals = await this.personalsService.getByCurrentMonth(coachId);

    return (schedules.length + personals.length) * 200;
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
  @Roles(RolesEnum.admin, RolesEnum.coach)
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
  ): Promise<Schedule[]> {
    const [updatedNumber, updatedRows] = await this.scheduleService.update(
      scheduleDto,
      id,
    );

    if (updatedNumber !== 1) {
      throw new HttpException(
        [
          {
            message: [
              'Requested schedule not found or duplicated - check the schedule id',
            ],
          },
        ],
        HttpStatus.BAD_REQUEST,
      );
    }
    return updatedRows;
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
