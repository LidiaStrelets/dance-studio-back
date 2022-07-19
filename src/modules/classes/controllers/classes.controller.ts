import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { ClassesService } from '@classesModule/services/classes.service';
import { CreateClassDto } from '@classesModule/dto/create.dto';
import { UpdateClassDto } from '@classesModule/dto/update.dto';
import { Class } from '@classesModule/models/classes.model';
import { IClassResponce } from '@classesModule/types/types';
import { RolesGuard } from '@guards/roles.guard';
import { ResponceDescription, UpdateResponce } from '@core/types';
import { Roles as RolesEnum } from '@core/types';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @ApiOperation({ summary: 'Create class' })
  @ApiOkResponse({
    type: CreateClassDto,
  })
  @ApiUnauthorizedResponse({ description: ResponceDescription.token })
  @ApiForbiddenResponse({
    description: ResponceDescription.adminRoute,
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateClassDto })
  @Roles(RolesEnum.admin)
  @UseGuards(RolesGuard)
  @Post()
  public async create(@Body() dto: CreateClassDto): Promise<IClassResponce> {
    const newClass = await this.classesService.create(dto);

    return this.mapClassToResponce(newClass);
  }

  @ApiOperation({ summary: 'Update class' })
  @ApiOkResponse({
    description: ResponceDescription.update,
  })
  @ApiUnauthorizedResponse({ description: ResponceDescription.token })
  @ApiForbiddenResponse({
    description: ResponceDescription.adminRoute,
  })
  @Roles(RolesEnum.admin)
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Patch('/:id')
  public async update(
    @Body() dto: UpdateClassDto,
    @Param('id') id: string,
  ): Promise<string> {
    const updatedClass = await this.classesService.update(dto, id);

    return updatedClass.length >= 1
      ? UpdateResponce.success
      : UpdateResponce.error;
  }

  private mapClassToResponce({ name, description, id }: Class): IClassResponce {
    return { name, description, id };
  }
}
