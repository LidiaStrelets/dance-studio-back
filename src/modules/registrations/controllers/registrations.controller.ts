import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { Roles as RolesType } from '@core/types';
import { RequestService } from '@services/request.service';
import { PaymentsService } from '@paymentsModule/services/payments.service';
import { SchedulesService } from '@schedulesModule/services/schedules.service';
import { CreateRegistrationDto } from '@registrationsModule/dto/add.dto';
import { Registration } from '@registrationsModule/models/registrations.model';
import { RegistrationsService } from '../services/registrations.service';
import {
  IRegistrationResponce,
  StatsResponce,
} from '@registrationsModule/types/types';
import { RolesGuard } from '@guards/roles.guard';
import { IN_DAY_HOURS } from '@core/constants';
import { ResponceDescription, Roles as RolesEnum } from '@core/types';
import { throwUuidException } from '@core/util';
import { FullResponce } from '@schedulesModule/types/types';
import { ClassesService } from '@classesModule/services/classes.service';
import { Classes } from '@classesModule/types/types';

@ApiTags('Registrations')
@Controller('registrations')
export class RegistrationsController {
  constructor(
    private registrationsService: RegistrationsService,
    private requestService: RequestService,
    private paymentService: PaymentsService,
    private scheduleService: SchedulesService,
    private classesService: ClassesService,
  ) {}

  @ApiOperation({ summary: 'Create registration' })
  @ApiOkResponse({ type: CreateRegistrationDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBadRequestResponse({
    description: ResponceDescription.userIdRequired,
  })
  @ApiResponse({
    status: HttpStatus.PAYMENT_REQUIRED,
    description: ResponceDescription.passExpired,
  })
  @ApiNotFoundResponse({
    description: ResponceDescription.noPlaces,
  })
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: ResponceDescription.notCoachRoute })
  @Roles(RolesEnum.admin, RolesEnum.client)
  @UseGuards(RolesGuard)
  @Post()
  public async create(
    @Body() dto: CreateRegistrationDto,
  ): Promise<IRegistrationResponce> {
    const newRegistration = await this.registrationsService.create(dto);

    return this.mapRegistrationToResponce(newRegistration);
  }

  @ApiOperation({ summary: 'Delete registration' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateRegistrationDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBadRequestResponse({ description: ResponceDescription.uuidException })
  @ApiBearerAuth()
  @ApiForbiddenResponse({
    description: `${ResponceDescription.notCoachRoute}, ${ResponceDescription.userIdRequired}`,
  })
  @Roles(RolesEnum.admin, RolesEnum.client)
  @UseGuards(RolesGuard)
  @Delete('/:scheduleId')
  public async delete(
    @Param(
      'scheduleId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    scheduleId: string,
  ): Promise<IRegistrationResponce[]> {
    const scheduleExisting = await this.scheduleService.getById(scheduleId);

    if (!scheduleExisting) {
      throw new HttpException(
        [
          {
            message: ['Class not found'],
          },
        ],
        HttpStatus.NOT_FOUND,
      );
    }
    const userRole = this.requestService.getUserRole();
    const userId = this.requestService.getUserId();
    const existingRegistration =
      await this.registrationsService.getByClientAndSchedule(
        userId,
        scheduleId,
      );
    if (!existingRegistration) {
      throw new HttpException(
        [
          {
            message: ['Enrollment not found'],
          },
        ],
        HttpStatus.NOT_FOUND,
      );
    }

    if (
      userRole === RolesType.coach ||
      (userRole === RolesType.client &&
        userId !== existingRegistration.client_id)
    ) {
      throw new HttpException(
        { message: `You are not allowed to cancell this enrollment!` },
        HttpStatus.BAD_REQUEST,
      );
    }

    const userPaym = await this.paymentService.getLastByUser(
      existingRegistration.client_id,
    );

    const schedule = await this.scheduleService.getById(
      existingRegistration.schedule_id,
    );

    const hours = this.registrationsService.convertMilisecondsToHours(
      new Date(schedule.date_time).getTime() - Date.now(),
    );

    if (hours > IN_DAY_HOURS) {
      this.paymentService.increaseAvailableClasses(userPaym.id);
    }

    const cancelled = await this.registrationsService.cancel(
      existingRegistration.id,
    );

    if (cancelled !== 1) {
      throw new HttpException(
        [
          {
            message: [`Error on deleting`],
          },
        ],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const registrations = await this.registrationsService.getAllByUser(userId);
    return registrations.map((item) => this.mapRegistrationToResponce(item));
  }

  @ApiOperation({
    summary: 'Get user registrations information',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: [CreateRegistrationDto] })
  @ApiUnauthorizedResponse({ description: ResponceDescription.token })
  @ApiForbiddenResponse({ description: ResponceDescription.userIdRequired })
  @ApiBadRequestResponse({ description: ResponceDescription.uuidException })
  @Get('/:userId')
  public async getAllByUser(
    @Param(
      'userId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    userId: string,
  ): Promise<IRegistrationResponce[]> {
    const registrations = await this.registrationsService.getAllByUser(userId);

    return registrations.map((item) => this.mapRegistrationToResponce(item));
  }

  @ApiOperation({
    summary: 'Get user registrations information',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: [CreateRegistrationDto] })
  @ApiUnauthorizedResponse({ description: ResponceDescription.token })
  @ApiForbiddenResponse({ description: ResponceDescription.userIdRequired })
  @ApiBadRequestResponse({ description: ResponceDescription.uuidException })
  @Get('/bySchedule/:id')
  public async getAllBySchedule(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    id: string,
  ): Promise<IRegistrationResponce[]> {
    const registrations = await this.registrationsService.getBySchedule(id);

    return registrations.map((item) => this.mapRegistrationToResponce(item));
  }

  @ApiOperation({
    summary: 'Get user registrations information',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: [CreateRegistrationDto] })
  @ApiUnauthorizedResponse({ description: ResponceDescription.token })
  @ApiForbiddenResponse({ description: ResponceDescription.userIdRequired })
  @ApiBadRequestResponse({ description: ResponceDescription.uuidException })
  @Get('/byDateMapped/:userId/:date')
  public async getByDateAndUserMapped(
    @Param(
      'userId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    userId: string,
    @Param('date')
    date: string,
  ): Promise<FullResponce[]> {
    const schedules = await this.scheduleService.getByDate(date);
    const registrations = await this.registrationsService.getAllByUser(userId);

    return this.scheduleService.mapSchedulesToResponce(
      schedules.filter(({ id }) =>
        registrations.some(({ schedule_id }) => id === schedule_id),
      ),
    );
  }

  @ApiOperation({
    summary: 'Get user registrations information',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: [CreateRegistrationDto] })
  @ApiUnauthorizedResponse({ description: ResponceDescription.token })
  @ApiForbiddenResponse({ description: ResponceDescription.userIdRequired })
  @ApiBadRequestResponse({ description: ResponceDescription.uuidException })
  @Get('/byDate/:userId/:date')
  public async getByDateAndUser(
    @Param(
      'userId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    userId: string,
    @Param('date')
    date: string,
  ): Promise<IRegistrationResponce[]> {
    const schedules = await this.scheduleService.getByDate(date);
    const registrations = await this.registrationsService.getAllByUser(userId);

    return registrations
      .filter(({ schedule_id }) =>
        schedules.some(({ id }) => id === schedule_id),
      )
      .map(this.mapRegistrationToResponce);
  }

  @ApiOperation({
    summary: 'Get user registrations information',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: [CreateRegistrationDto] })
  @ApiUnauthorizedResponse({ description: ResponceDescription.token })
  @ApiForbiddenResponse({ description: ResponceDescription.userIdRequired })
  @ApiBadRequestResponse({ description: ResponceDescription.uuidException })
  @Get('/stats/:userId')
  public async getStats(
    @Param(
      'userId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    userId: string,
  ): Promise<StatsResponce> {
    const registrations = await this.registrationsService.getAllByUser(userId);
    const classes = await this.classesService.get();

    const schedules = await Promise.all(
      registrations.map(({ schedule_id }) =>
        this.scheduleService.getById(schedule_id),
      ),
    );

    const attended = schedules.filter(
      ({ date_time }) => date_time < new Date(Date.now()),
    );

    const responcePart = {
      totalMinutes: attended.reduce(
        (min, schedule) => min + schedule.duration,
        0,
      ),
      totalClasses: attended.length,
    };

    const responce = Object.keys(Classes).reduce((responce, key) => {
      responce[key] = attended.filter(
        (item) =>
          item.class_id ===
          classes.find((classItem) => classItem.name === Classes[key]).id,
      ).length;
      return responce;
    }, responcePart);

    return responce;
  }

  private mapRegistrationToResponce({
    schedule_id,
    client_id,
    id,
  }: Registration): IRegistrationResponce {
    return {
      schedule_id,
      client_id,
      id,
    };
  }
}
