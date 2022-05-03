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
import { DataOwnerGuard } from 'src/auth/data-owner.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateRegistrationDto } from './dto/add-registration.dto';
import { Registration } from './registrations.model';
import { RegistrationsService } from './registrations.service';

@ApiTags('Registrations')
@Controller('registrations')
export class RegistrationsController {
  constructor(private registrationsService: RegistrationsService) {}

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
  createRegistration(
    @Body() paymentDto: CreateRegistrationDto,
    @Headers() headers,
  ) {
    return this.registrationsService.createRegistration(paymentDto, headers);
  }

  @ApiOperation({ summary: 'Delete registration' })
  @ApiResponse({ status: 200, type: Registration })
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
  deleteRegistration(@Param('regId') regId: string, @Headers() headers) {
    return this.registrationsService.cancelRegistration(regId, headers);
  }

  @ApiOperation({
    summary: 'Get user registrations information',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiResponse({ status: 200, type: [Registration] })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(DataOwnerGuard)
  @Get('/:userId')
  getUser(@Param('userId') userId: string) {
    return this.registrationsService.getUserRegistrations(Number(userId));
  }
}
