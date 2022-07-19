import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { RolesGuard } from '@guards/roles.guard';
import { RegisterDto } from '@usersModule/dto/register.dto';
import { UpdateUserDto } from '@usersModule/dto/update.dto';
import { UsersService } from '@usersModule/services/users.service';
import { User } from '@usersModule/models/users.model';
import { IUserResponce } from '@usersModule/types/types';
import { UpdateRoleDto } from '@usersModule/dto/update-role.dto';
import { BodyValidPipe } from '@usersModule/pipes/bodyValid.pipe';
import { ResponceDescription, UpdateResponce } from '@core/types';
import { Roles as RolesEnum } from '@core/types';
import { throwUuidException } from '@core/util';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: [RegisterDto] })
  @ApiUnauthorizedResponse({ description: ResponceDescription.token })
  @ApiForbiddenResponse({ description: ResponceDescription.adminRoute })
  @Roles(RolesEnum.admin)
  @UseGuards(RolesGuard)
  @Get()
  public async getAll(): Promise<IUserResponce[]> {
    const users = await this.userService.getAll();
    return users.map((user) => this.mapUserToResponce(user));
  }

  @ApiOperation({
    summary: 'Get data about one user - allowed to data owner or admin',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: RegisterDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.notCoachRoute })
  @ApiBadRequestResponse({ description: ResponceDescription.uuidException })
  @Get('/:userId')
  @Roles(RolesEnum.admin, RolesEnum.client)
  @UseGuards(RolesGuard)
  public async getById(
    @Param(
      'userId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    userId: string,
  ): Promise<IUserResponce> {
    const user = await this.userService.getById(userId);
    return this.mapUserToResponce(user);
  }

  @ApiOperation({ summary: 'Add classes to the coach' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: RegisterDto })
  @ApiUnauthorizedResponse({ description: ResponceDescription.token })
  @ApiForbiddenResponse({ description: ResponceDescription.adminRoute })
  @Roles(RolesEnum.admin)
  @UseGuards(RolesGuard)
  @Patch('/updateRole')
  public async updateRole(@Body() dto: UpdateRoleDto): Promise<string> {
    const updatedUser = await this.userService.updateRole(dto);

    return updatedUser.length >= 1
      ? UpdateResponce.success
      : UpdateResponce.error;
  }

  @ApiOperation({ summary: 'Update schedule' })
  @ApiOkResponse({ description: ResponceDescription.update })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.notCoachRoute })
  @Roles(RolesEnum.admin, RolesEnum.client)
  @UseGuards(RolesGuard)
  @Patch('/:userId')
  public async update(
    @Body(BodyValidPipe) dto: UpdateUserDto,
    @Param(
      'userId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    id: string,
  ): Promise<string> {
    const updatedUser = await this.userService.update(dto, id);

    return updatedUser.length >= 1
      ? UpdateResponce.success
      : UpdateResponce.error;
  }

  private mapUserToResponce({
    email,
    firstname,
    lastname,
    birth_date,
    information,
    id,
    role,
  }: User): IUserResponce {
    return {
      email,
      firstname,
      lastname,
      birth_date,
      information,
      id,
      role,
    };
  }
}
