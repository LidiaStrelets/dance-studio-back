import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { RequestService } from '@services/request.service';
import { PaymentsService } from '@paymentsModule/payments.service';
import { SchedulesService } from '@schedulesModule/schedules.service';
import { UsersService } from '@usersModule/users.service';
import { CreateDto } from '@registrationsModule/dto/add.dto';
import { Registration } from '@registrationsModule/registrations.model';
import {
  convertMilisecondsToDays,
  convertMilisecondsToHours,
  RegistrationsService,
} from './registrations.service';
import { Roles as RolesEnum } from '@rolesModule/types';

@ApiTags('Registrations')
@Controller('registrations')
export class RegistrationsController {
  constructor(
    private registrationsService: RegistrationsService,
    private requestService: RequestService,
    private userService: UsersService,
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
  @Post()
  async create(@Body() dto: CreateDto, @Headers() headers) {
    const userid = this.requestService.getUserId();

    const user = await this.userService.getById(
      dto.client_id.toString() || userid,
    );

    if (user.roles.some((role) => role.title !== RolesEnum.client))
      throw new HttpException(
        { message: 'Registration can be created only for the clients!' },
        HttpStatus.BAD_REQUEST,
      );

    const client_id = dto.client_id || userid;

    if (await this.registrationsService.find(client_id, dto.schedule_id))
      throw new HttpException(
        { message: 'You already signed for this class!' },
        HttpStatus.BAD_REQUEST,
      );

    const userPaym = await this.paymentService.getLastByUser(client_id);

    const days = convertMilisecondsToDays(
      Date.now() - new Date(userPaym.createdAt).getTime(),
    );

    if (days > 30 || userPaym.classes_left === 0)
      throw new HttpException(
        {
          message:
            'Your pass has ended! Make a new payment to create a registration!',
        },
        HttpStatus.PAYMENT_REQUIRED,
      );

    const scheduleItem = await this.scheduleService.get(dto.schedule_id);

    if (scheduleItem.places_left === 0)
      throw new HttpException(
        {
          message: 'No places left for this class, try another one!',
        },
        HttpStatus.NOT_FOUND,
      );
    else {
      this.scheduleService.decreaseAvailableSpots(dto.schedule_id);
      if (userPaym.classes_left !== 1000) {
        this.paymentService.decreaseAvailableClasses(userPaym.id);
      }
    }

    return await this.registrationsService.create(dto, headers);
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
  @Delete('/:regId')
  async delete(@Param('regId') regId: string) {
    const existingReg = await this.registrationsService.findById(regId);

    if (!existingReg)
      throw new HttpException(
        { message: `Registration doesn't exist` },
        HttpStatus.NOT_FOUND,
      );

    const userPaym = await this.paymentService.getLastByUser(
      existingReg.client_id,
    );

    const hours = convertMilisecondsToHours(
      Date.now() - new Date(existingReg.createdAt).getTime(),
    );
    if (hours < 24) {
      this.paymentService.increaseAvailableClasses(userPaym.id);
    }

    this.scheduleService.increaseAvailableSpots(existingReg.schedule_id);

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
  async getAllByUser(@Param('userId') userId: string) {
    return await this.registrationsService.getAllByUser(userId);
  }
}
