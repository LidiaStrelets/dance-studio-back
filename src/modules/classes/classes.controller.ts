import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Class } from './classes.model';
import { ClassesService } from './classes.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @ApiOperation({ summary: 'Create class' })
  @ApiResponse({ status: 200, type: Class })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  // @Roles('admin')
  @Post()
  async create(@Body() dto: CreateDto) {
    return await this.classesService.create(dto);
  }

  @ApiOperation({ summary: 'Update class' })
  @ApiResponse({ status: 200, type: Class })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin')
  @Patch('/:id')
  async update(@Body() dto: UpdateDto, @Param('id') id: string) {
    return await this.classesService.update(dto, Number(id));
  }
}
