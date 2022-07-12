import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { CreateDto } from '@pricesModule/dto/add.dto';
import { UpdateDto } from '@pricesModule/dto/update.dto';
import { PricesService } from '@pricesModule/services/prices.service';
import { Price } from '@pricesModule/models/prices.model';
import { IPriceResponce } from '@pricesModule/types/types';
import { RolesGuard } from '@guards/roles.guard';

@ApiTags('Prices')
@Controller('prices')
export class PricesController {
  constructor(private pricesService: PricesService) {}

  @ApiOperation({ summary: 'Create price' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateDto })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user!',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  public async ceate(@Body() dto: CreateDto): Promise<IPriceResponce> {
    const newPrice = await this.pricesService.create(dto);

    return this.mapPriceToResponce(newPrice);
  }

  @ApiOperation({ summary: 'Get prices' })
  @ApiResponse({ status: HttpStatus.OK, type: [CreateDto] })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user!',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Get()
  public async getAll(): Promise<IPriceResponce[]> {
    const prices = await this.pricesService.getAll();

    return prices.map((price) => this.mapPriceToResponce(price));
  }

  @ApiOperation({ summary: 'Update price' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateDto })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user!',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch('/:id')
  public async update(
    @Body() dto: UpdateDto,
    @Param('id') id: string,
  ): Promise<string> {
    const updatedPrice = await this.pricesService.update(dto, id);

    return updatedPrice ? 'success' : 'error';
  }

  private mapPriceToResponce(price: Price): IPriceResponce {
    return {
      classes_amount: price.classes_amount,
      price: price.price,
      id: price.id,
    };
  }
}
