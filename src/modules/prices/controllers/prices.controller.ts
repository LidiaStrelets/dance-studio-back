import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { CreatePriceDto } from '@pricesModule/dto/add.dto';
import { UpdatePriceDto } from '@pricesModule/dto/update.dto';
import { PricesService } from '@pricesModule/services/prices.service';
import { Price } from '@pricesModule/models/prices.model';
import { IPriceResponce } from '@pricesModule/types/types';
import { RolesGuard } from '@guards/roles.guard';
import { ResponceDescription, UpdateResponce } from '@core/types';
import { Roles as RolesEnum } from '@core/types';
import { throwUuidException } from '@core/util';

@ApiTags('Prices')
@Controller('prices')
export class PricesController {
  constructor(private pricesService: PricesService) {}

  @ApiOperation({ summary: 'Create price' })
  @ApiOkResponse({ type: CreatePriceDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.adminRoute })
  @ApiBearerAuth()
  @Roles(RolesEnum.admin)
  @UseGuards(RolesGuard)
  @Post()
  public async create(@Body() dto: CreatePriceDto): Promise<IPriceResponce> {
    const newPrice = await this.pricesService.create(dto);

    return this.mapPriceToResponce(newPrice);
  }

  @ApiOperation({ summary: 'Get prices' })
  @ApiOkResponse({ type: [CreatePriceDto] })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBearerAuth()
  @Get()
  public async getAll(): Promise<IPriceResponce[]> {
    const prices = await this.pricesService.getAll();

    return prices.map((price) => this.mapPriceToResponce(price));
  }

  @ApiOperation({ summary: 'Update price' })
  @ApiOkResponse({ description: ResponceDescription.update })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBadRequestResponse({ description: ResponceDescription.uuidException })
  @ApiForbiddenResponse({ description: ResponceDescription.adminRoute })
  @ApiBearerAuth()
  @Roles(RolesEnum.admin)
  @UseGuards(RolesGuard)
  @Patch('/:id')
  public async update(
    @Body() dto: UpdatePriceDto,
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    id: string,
  ): Promise<string> {
    const updatedPrice = await this.pricesService.update(dto, id);

    return updatedPrice.length >= 1
      ? UpdateResponce.success
      : UpdateResponce.error;
  }

  private mapPriceToResponce({
    classes_amount,
    price,
    id,
  }: Price): IPriceResponce {
    return {
      classes_amount,
      price,
      id,
    };
  }
}
