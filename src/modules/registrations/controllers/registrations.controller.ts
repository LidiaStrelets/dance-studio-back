import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { RequestService } from '@services/request.service';
import { PaymentsService } from '@paymentsModule/services/payments.service';
import { SchedulesService } from '@schedulesModule/services/schedules.service';
import { CreateDto } from '@registrationsModule/dto/add.dto';
import { Registration } from '@registrationsModule/models/registrations.model';
import { RegistrationsService } from '../services/registrations.service';
import { IRegistrationResponce } from '@registrationsModule/types/types';
import { RolesGuard } from '@guards/roles.guard';

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
  @ApiResponse({ status: 200, type: Registration })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 400, description: 'Wrong data passed' })
  @ApiResponse({
    status: 402,
    description:
      'Your pass has ended! Make a new payment to create a registration!',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 404,
    description: 'No places left for this class, try another one!',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Roles('admin', 'client')
  @UseGuards(RolesGuard)
  @Post()
  public async create(
    @Body() dto: CreateDto,
    @Headers() headers,
  ): Promise<IRegistrationResponce> {
    const userid = this.requestService.getUserId();

    const client_id = dto.client_id || userid;

    const userPaym = await this.paymentService.getLastByUser(client_id);

    this.scheduleService.decreaseAvailableSpots(dto.schedule_id);

    if (userPaym.classes_left !== 1000) {
      this.paymentService.decreaseAvailableClasses(userPaym.id);
    }

    const newRegistration = await this.registrationsService.create(
      dto,
      headers,
    );

    return this.mapRegistrationToResponce(newRegistration);
  }

  @ApiOperation({ summary: 'Delete registration' })
  @ApiResponse({ status: 200, type: CreateDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 404,
    description: `Registration doesn't exist`,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Roles('admin', 'client')
  @UseGuards(RolesGuard)
  @Delete('/:regId')
  public async delete(@Param('regId') regId: string): Promise<number> {
    const existingRegistration = await this.registrationsService.findById(
      regId,
    );

    const userPaym = await this.paymentService.getLastByUser(
      existingRegistration.client_id,
    );

    const hours = this.registrationsService.convertMilisecondsToHours(
      Date.now() - new Date(existingRegistration.createdAt).getTime(),
    );
    if (hours < 24) {
      this.paymentService.increaseAvailableClasses(userPaym.id);
    }

    this.scheduleService.increaseAvailableSpots(
      existingRegistration.schedule_id,
    );

    return await this.registrationsService.cancel(regId);
  }

  @ApiOperation({
    summary: 'Get user registrations information',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiResponse({ status: 200, type: [CreateDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('/:userId')
  public async getAllByUser(
    @Param('userId') userId: string,
  ): Promise<IRegistrationResponce[]> {
    const registrations = await this.registrationsService.getAllByUser(userId);

    return registrations.map((item) => this.mapRegistrationToResponce(item));
  }

  private mapRegistrationToResponce(item: Registration): IRegistrationResponce {
    return {
      schedule_id: item.schedule_id,
      client_id: item.client_id,
      id: item.id,
    };
  }
}
