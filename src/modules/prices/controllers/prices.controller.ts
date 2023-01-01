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
import { ResponceDescription } from '@core/types';
import { Roles as RolesEnum } from '@core/types';
import { throwUuidException } from '@core/util';
import { UpdateErrorService } from '@services/updateError/update-error.service';

@ApiTags('Prices')
@Controller('prices')
export class PricesController {
  constructor(
    private pricesService: PricesService,
    private updateErrorService: UpdateErrorService,
  ) {}

  @ApiOperation({ summary: 'Create price' })
  @ApiOkResponse({ type: CreatePriceDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: ResponceDescription.adminRoute })
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
  @ApiOkResponse({ type: CreatePriceDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBadRequestResponse({
    description: `${ResponceDescription.uuidException}; ${ResponceDescription.update}`,
  })
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: ResponceDescription.adminRoute })
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
  ): Promise<IPriceResponce> {
    const [updatedNumber, updatedPrices] = await this.pricesService.update(
      dto,
      id,
    );

    this.updateErrorService.throwError(updatedNumber);

    return this.mapPriceToResponce(updatedPrices[0]);
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
