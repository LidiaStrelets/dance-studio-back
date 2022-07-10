import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { RequestService } from '@services/request.service';
import { PricesService } from '@pricesModule/services/prices.service';
import { UsersService } from '@usersModule/services/users.service';
import { CreateDto } from '@paymentsModule/dto/add.dto';
import { Payment } from '@paymentsModule/models/payments.model';
import { PaymentsService } from '@paymentsModule/services/payments.service';
import { Roles as RolesEnum } from '@rolesModule/types/types';
import { IPaymentResponce } from '@paymentsModule/types/types';

@Controller('payments')
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private requestServise: RequestService,
    private priceService: PricesService,
    private userService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Create payment' })
  @ApiResponse({ status: 200, type: Payment })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Roles('admin', 'client')
  @Post()
  public async create(@Body() dto: CreateDto): Promise<IPaymentResponce> {
    const price = await this.priceService.getById(dto.price_id);

    const client_id = dto.user_id || this.requestServise.getUserId();
    const user = await this.userService.getById(client_id.toString());

    if (user.roles.some((role) => role.title !== RolesEnum.client)) {
      throw new HttpException(
        { message: 'Payments can be created only for the clients!' },
        HttpStatus.BAD_REQUEST,
      );
    }

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
  @ApiResponse({ status: 200, type: [CreateDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('/:userId')
  public async getAllByUser(
    @Param('userId') userId: string,
  ): Promise<IPaymentResponce[]> {
    const payments = await this.paymentsService.getAllByUser(userId);

    return payments.map((payment) => this.mapPaymentToResponce(payment));
  }

  private mapPaymentToResponce(payment: Payment): IPaymentResponce {
    return {
      classes_left: payment.classes_left,
      price_id: payment.price_id,
      client_id: payment.client_id,
      id: payment.id,
    };
  }
}
