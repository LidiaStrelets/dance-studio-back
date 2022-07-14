import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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
  @ApiResponse({ status: HttpStatus.OK, type: CreateDto })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user!',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
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
  @ApiResponse({ status: HttpStatus.OK, type: CreateDto })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user!',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Roles('admin')
  @Patch('/:id')
  public async update(
    @Body() scheduleDto: UpdateDto,
    @Param('id') id: string,
  ): Promise<string> {
    const updatedSchedule = await this.scheduleService.update(scheduleDto, id);
    return updatedSchedule.length >= 1 ? 'success' : 'error';
  }

  private mapScheduleToResponce({
    coach,
    hall,
    class: class_id,
    date_time,
    places_left,
    id,
  }: Schedule): IScheduleResponce {
    return {
      coach,
      hall,
      class: class_id,
      date_time,
      places_left,
      id,
    };
  }
}
