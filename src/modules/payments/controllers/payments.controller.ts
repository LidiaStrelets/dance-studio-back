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
import { RequestService } from '@services/request.service';
import { PricesService } from '@pricesModule/services/prices.service';
import { CreatePaymentDto } from '@paymentsModule/dto/add.dto';
import { Payment } from '@paymentsModule/models/payments.model';
import { PaymentsService } from '@paymentsModule/services/payments.service';
import { IPaymentResponce } from '@paymentsModule/types/types';
import { RolesGuard } from '@guards/roles.guard';
import { ResponceDescription } from '@core/types';
import { Roles as RolesEnum } from '@core/types';
import { throwUuidException } from '@core/util';

@Controller('payments')
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private requestServise: RequestService,
    private priceService: PricesService,
  ) {}

  @ApiOperation({ summary: 'Create payment' })
  @ApiOkResponse({ type: CreatePaymentDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.notCoachRoute })
  @ApiBasicAuth()
  @Roles(RolesEnum.admin, RolesEnum.client)
  @UseGuards(RolesGuard)
  @Post()
  public async create(
    @Body() dto: CreatePaymentDto,
  ): Promise<IPaymentResponce> {
    const price = await this.priceService.getById(dto.price_id);

    if (!price) {
      throw new HttpException(
        { message: 'Price id is invalid', problem_field: 'price_id' },
        HttpStatus.BAD_REQUEST,
      );
    }

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
  @ApiBearerAuth()
  @ApiOkResponse({ type: [CreatePaymentDto] })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.notCoachRoute })
  @ApiBadRequestResponse({ description: ResponceDescription.uuidException })
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

    if (payments.length < 1) {
      throw new HttpException(
        [
          {
            message: 'No payments for requested user',
          },
        ],
        HttpStatus.BAD_REQUEST,
      );
    }

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
