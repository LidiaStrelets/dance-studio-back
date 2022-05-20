import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Hall } from './halls.model';
import { HallsService } from './halls.service';

@ApiTags('Halls')
@Controller('halls')
export class HallsController {
  constructor(private hallService: HallsService) {}

  @ApiOperation({ summary: 'Create hall' })
  @ApiResponse({ status: 200, type: Hall })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  async ceate(@Body() вto: CreateDto) {
    return await this.hallService.create(вto);
  }

  @ApiOperation({ summary: 'Update hall' })
  @ApiResponse({ status: 200, type: Hall })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch('/:id')
  update(@Body() вto: UpdateDto, @Param('id') id: string) {
    return this.hallService.update(вto, Number(id));
  }
}
