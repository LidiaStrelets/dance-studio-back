import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { RequestService } from '@services/request.service';
import { PricesService } from '@pricesModule/services/prices.service';
import { CreateDto } from '@paymentsModule/dto/add.dto';
import { Payment } from '@paymentsModule/models/payments.model';
import { PaymentsService } from '@paymentsModule/services/payments.service';
import { IPaymentResponce } from '@paymentsModule/types/types';
import { RolesGuard } from '@guards/roles.guard';

@Controller('payments')
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private requestServise: RequestService,
    private priceService: PricesService,
  ) {}

  @ApiOperation({ summary: 'Create payment' })
  @ApiResponse({ status: HttpStatus.OK, type: Payment })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user!',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Roles('admin', 'client')
  @UseGuards(RolesGuard)
  @Post()
  public async create(@Body() dto: CreateDto): Promise<IPaymentResponce> {
    const price = await this.priceService.getById(dto.price_id);

    const client_id = dto.user_id || this.requestServise.getUserId();

    const newPayment = await this.paymentsService.create(
      dto,
      client_id,
      price.classes_amount,
    );

    return this.mapPaymentToResponce(newPayment);
  }

  @ApiOperation({
    summary: 'Get user payments information',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [CreateDto] })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user!',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Roles('admin', 'client')
  @UseGuards(RolesGuard)
  @Get('/:userId')
  public async getAllByUser(
    @Param('userId') userId: string,
  ): Promise<IPaymentResponce[]> {
    const payments = await this.paymentsService.getAllByUser(userId);

    return payments.map((payment) => this.mapPaymentToResponce(payment));
  }

  private mapPaymentToResponce({
    classes_left,
    price_id,
    client_id,
    id,
  }: Payment): IPaymentResponce {
    return {
      classes_left,
      price_id,
      client_id,
      id,
    };
  }
}
