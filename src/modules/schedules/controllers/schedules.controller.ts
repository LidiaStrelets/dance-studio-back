import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { HallsService } from '@hallsModule/services/halls.service';
import { CreateDto } from '@schedulesModule/dto/create.dto';
import { UpdateDto } from '@schedulesModule/dto/update.dto';
import { SchedulesService } from '@schedulesModule/services/schedules.service';
import { Schedule } from '@schedulesModule/models/schedules.model';
import { IScheduleResponce } from '@schedulesModule/types/types';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(
    private scheduleService: SchedulesService,
    private hallsService: HallsService,
  ) {}

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiOperation({ summary: 'Add item to the schedule' })
  @ApiResponse({ status: 200, type: CreateDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin')
  @Post()
  public async add(@Body() dto: CreateDto): Promise<IScheduleResponce> {
    const availablePoles = await this.hallsService.getPolesAmount(dto.hall);

    const newItem = await this.scheduleService.create(dto, availablePoles);
    return this.mapScheduleToResponce(newItem);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiOperation({ summary: 'Update schedule' })
  @ApiResponse({ status: 200, type: CreateDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin')
  @Patch('/:id')
  public async update(
    @Body() scheduleDto: UpdateDto,
    @Param('id') id: string,
  ): Promise<string> {
    const updatedSchedule = await this.scheduleService.update(scheduleDto, id);
    return updatedSchedule ? 'success' : 'error';
  }

  private mapScheduleToResponce(item: Schedule): IScheduleResponce {
    return {
      coach: item.coach,
      hall: item.hall,
      class: item.class,
      date_time: item.date_time,
      places_left: item.places_left,
      id: item.id,
    };
  }
}
