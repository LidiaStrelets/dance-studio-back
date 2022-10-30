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
import { IRegistrationResponce } from '@registrationsModule/types/types';
import { RolesGuard } from '@guards/roles.guard';
import { IN_DAY_HOURS, UNLIMITED_AMOUNT } from '@core/constants';
import { ResponceDescription, Roles as RolesEnum } from '@core/types';
import { throwUuidException } from '@core/util';
import { UsersService } from '@usersModule/services/users.service';

@ApiTags('Registrations')
@Controller('registrations')
export class RegistrationsController {
  constructor(
    private registrationsService: RegistrationsService,
    private requestService: RequestService,
    private paymentService: PaymentsService,
    private scheduleService: SchedulesService,
    private userService: UsersService,
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
  @ApiForbiddenResponse({ description: ResponceDescription.notCoachRoute })
  @ApiNotFoundResponse({
    description: ResponceDescription.noPlaces,
  })
  @ApiBearerAuth()
  @Roles(RolesEnum.admin, RolesEnum.client)
  @UseGuards(RolesGuard)
  @Post()
  public async create(
    @Body() dto: CreateRegistrationDto,
  ): Promise<IRegistrationResponce> {
    // const client_id = dto.client_id || this.requestService.getUserId();

    // const userPaym = await this.paymentService.getLastByUser(client_id);

    // if (userPaym.classes_left !== UNLIMITED_AMOUNT) {
    //   this.paymentService.decreaseAvailableClasses(userPaym.id);
    // }

    const newRegistration = await this.registrationsService.create(dto);

    return this.mapRegistrationToResponce(newRegistration);
  }

  @ApiOperation({ summary: 'Delete registration' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateRegistrationDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({
    description: `${ResponceDescription.notCoachRoute}, ${ResponceDescription.userIdRequired}`,
  })
  @ApiBadRequestResponse({ description: ResponceDescription.uuidException })
  @ApiBearerAuth()
  @Roles(RolesEnum.admin, RolesEnum.client)
  @UseGuards(RolesGuard)
  @Delete('/:regId')
  public async delete(
    @Param(
      'regId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    regId: string,
  ): Promise<IRegistrationResponce[]> {
    const existingRegistration = await this.registrationsService.getById(regId);
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
    const userRole = this.requestService.getUserRole();
    const userId = this.requestService.getUserId();

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

    // const userPaym = await this.paymentService.getLastByUser(
    //   existingRegistration.client_id,
    // );

    const schedule = await this.scheduleService.getById(
      existingRegistration.schedule_id,
    );

    const hours = this.registrationsService.convertMilisecondsToHours(
      new Date(schedule.date_time).getTime() - Date.now(),
    );

    if (hours < IN_DAY_HOURS) {
      throw new HttpException(
        [
          {
            message: [`Impossible to cancell enrollment less then in 24 hours`],
          },
        ],
        HttpStatus.BAD_REQUEST,
      );
      // this.paymentService.increaseAvailableClasses(userPaym.id);
    }

    const cancelled = await this.registrationsService.cancel(regId);

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
