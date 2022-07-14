import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { ClassesService } from '@classesModule/services/classes.service';
import { CreateDto } from '@classesModule/dto/create.dto';
import { UpdateDto } from '@classesModule/dto/update.dto';
import { Class } from '@classesModule/models/classes.model';
import { IClassResponce } from '@classesModule/types/types';
import { RolesGuard } from '@guards/roles.guard';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @ApiOperation({ summary: 'Create class' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateDto })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user!',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  public async create(@Body() dto: CreateDto): Promise<IClassResponce> {
    const newClass = await this.classesService.create(dto);

    return this.mapClassToResponce(newClass);
  }

  @ApiOperation({ summary: 'Update class' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateDto })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user!',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Roles('admin')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Patch('/:id')
  public async update(
    @Body() dto: UpdateDto,
    @Param('id') id: string,
  ): Promise<string> {
    const updatedClass = await this.classesService.update(dto, id);

    return updatedClass.length >= 1 ? 'success' : 'error';
  }

  private mapClassToResponce({ name, description, id }: Class): IClassResponce {
    return { name, description, id };
  }
}
