import {
  Body,
  Controller,
  Delete,
  Get,
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

@ApiTags('Registrations')
@Controller('registrations')
export class RegistrationsController {
  constructor(
    private registrationsService: RegistrationsService,
    private requestService: RequestService,
    private paymentService: PaymentsService,
    private scheduleService: SchedulesService,
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
    const client_id = dto.client_id || this.requestService.getUserId();

    const userPaym = await this.paymentService.getLastByUser(client_id);

    // this.scheduleService.decreaseAvailableSpots(dto.schedule_id);

    if (userPaym.classes_left !== UNLIMITED_AMOUNT) {
      this.paymentService.decreaseAvailableClasses(userPaym.id);
    }

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
  ): Promise<number> {
    const existingRegistration = await this.registrationsService.getById(regId);

    const userPaym = await this.paymentService.getLastByUser(
      existingRegistration.client_id,
    );

    const hours = this.registrationsService.convertMilisecondsToHours(
      Date.now() - new Date(existingRegistration.createdAt).getTime(),
    );
    if (hours < IN_DAY_HOURS) {
      this.paymentService.increaseAvailableClasses(userPaym.id);
    }

    // this.scheduleService.increaseAvailableSpots(
    //   existingRegistration.schedule_id,
    // );

    return await this.registrationsService.cancel(regId);
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
