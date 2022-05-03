import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DataOwnerGuard } from 'src/auth/data-owner.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreatePaymentDto } from './dto/add-payment.dto';
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
  @Roles('admin', 'client')
  @UseGuards(RolesGuard)
  @Post()
  createPayment(@Body() paymentDto: CreatePaymentDto, @Headers() headers) {
    return this.paymentsService.createPayment(paymentDto, headers);
  }

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
  @UseGuards(DataOwnerGuard)
  @Get('/:userId')
  getUser(@Param('userId') userId: string) {
    return this.paymentsService.getUserPayments(Number(userId));
  }
}
