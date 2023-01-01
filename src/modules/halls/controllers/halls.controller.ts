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
import { ResponceDescription } from '@core/types';
import { Roles as RolesEnum } from '@core/types';
import { throwUuidException } from '@core/util';
import { UpdateErrorService } from '@services/updateError/update-error.service';

@ApiTags('Halls')
@Controller('halls')
export class HallsController {
  constructor(
    private hallService: HallsService,
    private updateErrorService: UpdateErrorService,
  ) {}

  @ApiOperation({ summary: 'Get halls' })
  @ApiOkResponse({ type: [CreateHallDto] })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBearerAuth()
  @Get()
  public async get(): Promise<IHallResponce[]> {
    const halls = await this.hallService.get();

    const mapped = halls.map((hall) => this.mapHallToResponce(hall));

    return mapped;
  }

  @ApiOperation({ summary: 'Create hall' })
  @ApiOkResponse({ type: CreateHallDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: ResponceDescription.adminRoute })
  @Roles(RolesEnum.admin)
  @UseGuards(RolesGuard)
  @Post()
  public async create(@Body() dto: CreateHallDto): Promise<IHallResponce> {
    const newHall = await this.hallService.create(dto);

    return this.mapHallToResponce(newHall);
  }

  @ApiOperation({ summary: 'Update hall' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: CreateHallDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBadRequestResponse({
    description: `${ResponceDescription.uuidException}; ${ResponceDescription.updateError}`,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.adminRoute })
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
  ): Promise<IHallResponce> {
    const [updatedNumber, updatedHalls] = await this.hallService.update(
      dto,
      id,
    );

    this.updateErrorService.throwError(updatedNumber);

    return this.mapHallToResponce(updatedHalls[0]);
  }

  private mapHallToResponce({
    name,
    description,
    poles_amount,
    id,
    nameUk,
    descriptionUk,
    picture,
  }: Hall): IHallResponce {
    return {
      name,
      nameUk,
      description,
      descriptionUk,
      poles_amount,
      id,
      picture,
    };
  }
}
