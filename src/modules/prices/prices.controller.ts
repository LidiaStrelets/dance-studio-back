import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { CreateDto } from '@pricesModule/dto/add.dto';
import { UpdateDto } from '@pricesModule/dto/update.dto';
import { PricesService } from '@pricesModule/prices.service';

@ApiTags('Prices')
@Controller('prices')
export class PricesController {
  constructor(private pricesService: PricesService) {}

  @ApiOperation({ summary: 'Create price' })
  @ApiResponse({ status: 200, type: CreateDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Roles('admin')
  @Post()
  async ceate(@Body() dto: CreateDto) {
    return await this.pricesService.create(dto);
  }

  @ApiOperation({ summary: 'Get prices' })
  @ApiResponse({ status: 200, type: [CreateDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Get()
  async getAll() {
    return await this.pricesService.getAll();
  }

  @ApiOperation({ summary: 'Update price' })
  @ApiResponse({ status: 200, type: CreateDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin')
  @Patch('/:id')
  update(@Body() dto: UpdateDto, @Param('id') id: string) {
    return this.pricesService.update(dto, id);
  }
}
