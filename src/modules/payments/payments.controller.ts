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
import { PricesService } from '@pricesModule/prices.service';
import { UsersService } from '@usersModule/users.service';
import { CreateDto } from '@paymentsModule/dto/add.dto';
import { Payment } from '@paymentsModule/payments.model';
import { PaymentsService } from '@paymentsModule/payments.service';
import { Roles as RolesEnum } from '@rolesModule/types';

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
  async create(@Body() dto: CreateDto) {
    const price = await this.priceService.getById(dto.price_id);

    const client_id = dto.user_id || this.requestServise.getUserId();
    const user = await this.userService.getById(client_id.toString());

    if (user.roles.some((role) => role.title !== RolesEnum.client))
      throw new HttpException(
        { message: 'Payments can be created only for the clients!' },
        HttpStatus.BAD_REQUEST,
      );
    return await this.paymentsService.create(
      dto,
      client_id,
      price.classes_amount,
    );
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
  async getAllByUser(@Param('userId') userId: string) {
    return await this.paymentsService.getAllByUser(userId);
  }
}
