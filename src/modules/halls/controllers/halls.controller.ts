import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { CreateDto } from '@hallsModule/dto/create.dto';
import { UpdateDto } from '@hallsModule/dto/update.dto';
import { HallsService } from '@hallsModule/services/halls.service';
import { Hall } from '@hallsModule/models/halls.model';
import { IHallResponce } from '@hallsModule/types/types';
import { RolesGuard } from '@guards/roles.guard';

@ApiTags('Halls')
@Controller('halls')
export class HallsController {
  constructor(private hallService: HallsService) {}

  @ApiOperation({ summary: 'Create hall' })
  @ApiResponse({ status: 200, type: CreateDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  public async ceate(@Body() вto: CreateDto): Promise<IHallResponce> {
    const newHall = await this.hallService.create(вto);

    return this.mapHallToResponce(newHall);
  }

  @ApiOperation({ summary: 'Update hall' })
  @ApiResponse({ status: 200, type: CreateDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch('/:id')
  public async update(
    @Body() dto: UpdateDto,
    @Param('id') id: string,
  ): Promise<string> {
    const updatedHall = await this.hallService.update(dto, id);

    return updatedHall ? 'success' : 'error';
  }

  private mapHallToResponce(hall: Hall): IHallResponce {
    return {
      name: hall.name,
      description: hall.description,
      poles_amount: hall.poles_amount,
      id: hall.id,
    };
  }
}
