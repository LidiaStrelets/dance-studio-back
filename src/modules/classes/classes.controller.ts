import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { ClassesService } from '@classesModule/classes.service';
import { CreateDto } from '@classesModule/dto/create.dto';
import { UpdateDto } from '@classesModule/dto/update.dto';
import { Class } from '@classesModule/classes.model';

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
  public async create(@Body() dto: CreateDto): Promise<Class> {
    return await this.classesService.create(dto);
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
  ): Promise<Class> {
    return await this.classesService.update(dto, id);
  }
}
