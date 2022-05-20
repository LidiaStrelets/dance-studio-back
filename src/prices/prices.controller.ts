import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsAuthGuard } from 'src/auth/isAuth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateDto } from './dto/add.dto';
import { UpdateDto } from './dto/update.dto';
import { Price } from './prices.model';
import { PricesService } from './prices.service';

@ApiTags('Prices')
@Controller('prices')
export class PricesController {
  constructor(private pricesService: PricesService) {}

  @ApiOperation({ summary: 'Create price' })
  @ApiResponse({ status: 200, type: Price })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  async ceate(@Body() dto: CreateDto) {
    return await this.pricesService.create(dto);
  }

  @ApiOperation({ summary: 'Get prices' })
  @ApiResponse({ status: 200, type: [Price] })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @UseGuards(IsAuthGuard)
  @Get()
  async getAll() {
    return await this.pricesService.getAll();
  }

  @ApiOperation({ summary: 'Update price' })
  @ApiResponse({ status: 200, type: Price })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch('/:id')
  update(@Body() dto: UpdateDto, @Param('id') id: string) {
    return this.pricesService.update(dto, Number(id));
  }
}
