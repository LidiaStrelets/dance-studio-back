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
import { Roles } from 'src/core/decorators/roles.decorator';
import { DataOwnerGuard } from 'src/core/guards/data-owner.guard';
import { CreateDto } from './dto/add.dto';
import { Registration } from './registrations.model';
import { RegistrationsService } from './registrations.service';

@ApiTags('Registrations')
@Controller('registrations')
export class RegistrationsController {
  constructor(private registrationsService: RegistrationsService) {}

  // @ApiOperation({ summary: 'Create registration' })
  // @ApiResponse({ status: 200, type: Registration })
  // @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  // @ApiResponse({ status: 400, description: 'Wrong data passed' })
  // @ApiResponse({
  //   status: 402,
  //   description:
  //     'Your pass has ended! Make a new payment to create a registration!',
  // })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @ApiResponse({
  //   status: 404,
  //   description: 'No places left for this class, try another one!',
  // })
  // @ApiHeader({
  //   name: 'Authorization',
  //   description: 'Bearer token',
  // })
  // @Roles('admin', 'client')
  // @Post()
  // async create(@Body() dto: CreateDto, @Headers() headers) {
  //   return await this.registrationsService.create(dto, headers);
  // }

  // @ApiOperation({ summary: 'Delete registration' })
  // @ApiResponse({ status: 200, type: CreateDto })
  // @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @ApiResponse({
  //   status: 404,
  //   description: `Registration doesn't exist`,
  // })
  // @ApiHeader({
  //   name: 'Authorization',
  //   description: 'Bearer token',
  // })
  // @Roles('admin', 'client')
  // @Delete('/:regId')
  // async delete(@Param('regId') regId: string, @Headers() headers) {
  //   return await this.registrationsService.cancel(regId, headers);
  // }

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
  @UseGuards(DataOwnerGuard)
  @Get('/:userId')
  async getAllByUser(@Param('userId') userId: string) {
    return await this.registrationsService.getAllByUser(Number(userId));
  }
}
