import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
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
import { ResponceDescription } from '@core/types';
import { Roles as RolesEnum } from '@core/types';
import { throwUuidException } from '@core/util';
import { UpdateErrorService } from '@services/updateError/update-error.service';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
  constructor(
    private classesService: ClassesService,
    private updateErrorService: UpdateErrorService,
  ) {}

  @ApiOperation({ summary: 'Create class' })
  @ApiOkResponse({
    type: CreateClassDto,
  })
  @ApiUnauthorizedResponse({ description: ResponceDescription.token })
  @ApiBearerAuth()
  @ApiBody({ type: CreateClassDto })
  @ApiForbiddenResponse({
    description: ResponceDescription.adminRoute,
  })
  @Roles(RolesEnum.admin)
  @UseGuards(RolesGuard)
  @Post()
  public async create(@Body() dto: CreateClassDto): Promise<IClassResponce> {
    const newClass = await this.classesService.create(dto);

    return this.mapClassToResponce(newClass);
  }

  @ApiOperation({ summary: 'Update class' })
  @ApiOkResponse({
    type: CreateClassDto,
  })
  @ApiUnauthorizedResponse({ description: ResponceDescription.token })
  @ApiBadRequestResponse({
    description: ResponceDescription.uuidException,
  })
  @ApiForbiddenResponse({
    description: ResponceDescription.adminRoute,
  })
  @Roles(RolesEnum.admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Patch('/:id')
  public async update(
    @Body() dto: UpdateClassDto,
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    id: string,
  ): Promise<IClassResponce> {
    const [updatedNumber, updatedClass] = await this.classesService.update(
      dto,
      id,
    );

    this.updateErrorService.throwError(updatedNumber);

    return this.mapClassToResponce(updatedClass[0]);
  }

  @ApiOperation({ summary: 'Get classes' })
  @ApiOkResponse({ type: [CreateClassDto] })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBearerAuth()
  @Get()
  public async get(): Promise<IClassResponce[]> {
    const classes = await this.classesService.get();

    const mapped = classes.map((classItem) =>
      this.mapClassToResponce(classItem),
    );

    return mapped;
  }

  @ApiOperation({ summary: 'Get class by id' })
  @ApiOkResponse({ type: CreateClassDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBadRequestResponse({
    description: ResponceDescription.uuidException,
  })
  @ApiBearerAuth()
  @Get('/:id')
  public async getById(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    id: string,
  ): Promise<IClassResponce> {
    const classItem = await this.classesService.getById(id);

    return this.mapClassToResponce(classItem);
  }

  private mapClassToResponce({
    name,
    description,
    id,
    nameUk,
    descriptionUk,
  }: Class): IClassResponce {
    return { name, description, id, nameUk, descriptionUk };
  }
}
