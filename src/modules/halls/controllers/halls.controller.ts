import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { CreateHallDto } from '@hallsModule/dto/create.dto';
import { UpdateHallDto } from '@hallsModule/dto/update.dto';
import { HallsService } from '@hallsModule/services/halls.service';
import { Hall } from '@hallsModule/models/halls.model';
import { IHallResponce } from '@hallsModule/types/types';
import { RolesGuard } from '@guards/roles.guard';
import { ResponceDescription, UpdateResponce } from '@core/types';
import { Roles as RolesEnum } from '@core/types';
import { throwUuidException } from '@core/util';

@ApiTags('Halls')
@Controller('halls')
export class HallsController {
  constructor(private hallService: HallsService) {}

  @ApiOperation({ summary: 'Create hall' })
  @ApiOkResponse({ type: CreateHallDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.adminRoute })
  @ApiBearerAuth()
  @Roles(RolesEnum.admin)
  @UseGuards(RolesGuard)
  @Post()
  public async create(@Body() dto: CreateHallDto): Promise<IHallResponce> {
    const newHall = await this.hallService.create(dto);

    return this.mapHallToResponce(newHall);
  }

  @ApiOperation({ summary: 'Update hall' })
  @ApiOkResponse({ type: ResponceDescription.update })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.adminRoute })
  @ApiBadRequestResponse({ description: ResponceDescription.uuidException })
  @ApiBearerAuth()
  @Roles(RolesEnum.admin)
  @UseGuards(RolesGuard)
  @Patch('/:id')
  public async update(
    @Body() dto: UpdateHallDto,
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    id: string,
  ): Promise<string> {
    const updatedHall = await this.hallService.update(dto, id);

    return updatedHall.length >= 1
      ? UpdateResponce.success
      : UpdateResponce.error;
  }

  private mapHallToResponce({
    name,
    description,
    poles_amount,
    id,
  }: Hall): IHallResponce {
    return {
      name,
      description,
      poles_amount,
      id,
    };
  }
}
