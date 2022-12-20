import {
  Body,
  Controller,
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
  ApiBasicAuth,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { RequestService } from '@services/request/request.service';
import { PricesService } from '@pricesModule/services/prices.service';
import { CreatePaymentDto } from '@paymentsModule/dto/add.dto';
import { PaymentsService } from '@paymentsModule/services/payments.service';
import { IPaymentResponce, PaymentCreated } from '@paymentsModule/types/types';
import { RolesGuard } from '@guards/roles.guard';
import { ResponceDescription } from '@core/types';
import { Roles as RolesEnum } from '@core/types';
import { throwUuidException } from '@core/util';

@Controller('payments')
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private priceService: PricesService,
  ) {}

  @ApiOperation({ summary: 'Create payment' })
  @ApiOkResponse({ type: CreatePaymentDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBasicAuth()
  @ApiForbiddenResponse({ description: ResponceDescription.notCoachRoute })
  @Roles(RolesEnum.admin, RolesEnum.client)
  @UseGuards(RolesGuard)
  @Post()
  public async create(
    @Body() dto: CreatePaymentDto,
  ): Promise<IPaymentResponce> {
    const price = await this.priceService.getById(dto.price_id);
    const newPayment = await this.paymentsService.create({
      ...dto,
      available_spots: price.classes_amount,
    });

    return this.mapPaymentToResponce(newPayment);
  }

  @ApiOperation({
    summary: 'Get user payments information',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: [CreatePaymentDto] })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBadRequestResponse({ description: ResponceDescription.uuidException })
  @ApiForbiddenResponse({ description: ResponceDescription.notCoachRoute })
  @Roles(RolesEnum.admin, RolesEnum.client)
  @UseGuards(RolesGuard)
  @Get('/:userId')
  public async getAllByUser(
    @Param(
      'userId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    userId: string,
  ): Promise<IPaymentResponce[]> {
    const payments = await this.paymentsService.getAllByUser(userId);

    const mapped = payments.map((payment) =>
      this.mapPaymentToResponce(payment),
    );

    return mapped.length === 0
      ? []
      : mapped.filter((payment) => payment.available_spots > 0).length > 0
      ? mapped.filter((payment) => payment.available_spots > 0)
      : [mapped[mapped.length - 1]];
  }

  private mapPaymentToResponce({
    price_id,
    user_id,
    id,
    createdAt,
    available_spots,
  }: PaymentCreated): IPaymentResponce {
    return {
      price_id,
      user_id,
      id,
      createdAt,
      available_spots,
    };
  }
}
