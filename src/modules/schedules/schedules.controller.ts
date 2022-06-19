import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/roles.decorator';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Schedule } from './schedules.model';
import { SchedulesService } from './schedules.service';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private scheduleService: SchedulesService) {}

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiOperation({ summary: 'Add item to the schedule' })
  @ApiResponse({ status: 200, type: Schedule })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @Roles('admin')
  @Post()
  // async add(@Body() dto: CreateDto) {
  //   return await this.scheduleService.create(dto);
  // }
  @ApiOperation({ summary: 'Update schedule' })
  @ApiResponse({ status: 200, type: Schedule })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @Roles('admin')
  @Patch('/:id')
  update(@Body() scheduleDto: UpdateDto, @Param('id') id: string) {
    return this.scheduleService.update(scheduleDto, Number(id));
  }
}
