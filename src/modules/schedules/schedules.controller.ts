import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { HallsService } from '@hallsModule/halls.service';
import { UsersService } from '@usersModule/users.service';
import { CreateDto } from '@schedulesModule/dto/create.dto';
import { UpdateDto } from '@schedulesModule/dto/update.dto';
import { SchedulesService } from '@schedulesModule/schedules.service';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(
    private scheduleService: SchedulesService,
    private usersService: UsersService,
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
  async add(@Body() dto: CreateDto) {
    const user = await this.usersService.getById(dto.coach.toString());

    if (!user.classes.some((user_class) => user_class.id === dto.class))
      throw new HttpException(
        `${user.firstname} ${user.lastname} doesn't conduct requested class!`,
        HttpStatus.BAD_REQUEST,
      );
    const availablePoles = await this.hallsService.getPolesAmount(dto.hall);

    return await this.scheduleService.create(dto, availablePoles);
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
  update(@Body() scheduleDto: UpdateDto, @Param('id') id: string) {
    return this.scheduleService.update(scheduleDto, id);
  }
}
