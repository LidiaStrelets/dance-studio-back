import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/roles.decorator';
import { CreateDto } from './dto/add.dto';
import { Payment } from './payments.model';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Create payment' })
  @ApiResponse({ status: 200, type: Payment })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  // @Roles('admin', 'client')
  @Post()
  // async create(@Body() dto: CreateDto, @Headers() headers) {
  //   return await this.paymentsService.create(dto, headers);
  // }
  @ApiOperation({
    summary: 'Get user payments information',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiResponse({ status: 200, type: [Payment] })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('/:userId')
  async getAllByUser(@Param('userId') userId: string) {
    return await this.paymentsService.getAllByUser(Number(userId));
  }
}
