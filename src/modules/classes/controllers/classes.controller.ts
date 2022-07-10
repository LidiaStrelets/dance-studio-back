import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { ClassesService } from '@classesModule/services/classes.service';
import { CreateDto } from '@classesModule/dto/create.dto';
import { UpdateDto } from '@classesModule/dto/update.dto';
import { Class } from '@classesModule/models/classes.model';
import { IClassResponce } from '@classesModule/types/types';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @ApiOperation({ summary: 'Create class' })
  @ApiResponse({ status: 200, type: CreateDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Roles('admin')
  @Post()
  public async create(@Body() dto: CreateDto): Promise<IClassResponce> {
    const newClass = await this.classesService.create(dto);

    return this.mapClassToResponce(newClass);
  }

  @ApiOperation({ summary: 'Update class' })
  @ApiResponse({ status: 200, type: CreateDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin')
  @Patch('/:id')
  public async update(
    @Body() dto: UpdateDto,
    @Param('id') id: string,
  ): Promise<string> {
    const updatedClass = await this.classesService.update(dto, id);

    return updatedClass ? 'success' : 'error';
  }

  private mapClassToResponce(item: Class): IClassResponce {
    return { name: item.name, description: item.description, id: item.id };
  }
}
