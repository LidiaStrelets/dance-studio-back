import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Res,
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
import { RolesGuard } from '@guards/roles.guard';
import { RegisterDto } from '@usersModule/dto/register.dto';
import { UpdateUserDto } from '@usersModule/dto/update.dto';
import { UsersService } from '@usersModule/services/users.service';
import { User } from '@usersModule/models/users.model';
import { EUpdateUser, IUserResponce } from '@usersModule/types/types';
import { UpdateRoleDto } from '@usersModule/dto/update-role.dto';
import { BodyValidPipe } from '@pipes/bodyValid.pipe';
import {
  ResponceDescription,
  TUpdateResponce,
  UpdateResponce,
} from '@core/types';
import { Roles as RolesEnum } from '@core/types';
import { throwUuidException } from '@core/util';
import { Response } from 'express';

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

    return users.map((user) => {
      return this.mapUserToResponce(user);
    });
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
  public async updateRole(
    @Body() dto: UpdateRoleDto,
  ): Promise<TUpdateResponce> {
    const updatedUser = await this.userService.updateRole(dto);

    return updatedUser.length >= 1
      ? UpdateResponce.success
      : UpdateResponce.error;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ description: ResponceDescription.update })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.notCoachRoute })
  @Roles(RolesEnum.admin, RolesEnum.client)
  @UseGuards(RolesGuard)
  @Patch('/:userId')
  public async update(
    @Body(new BodyValidPipe(EUpdateUser)) dto: UpdateUserDto,
    @Param(
      'userId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    id: string,
    @Res() res: Response,
  ) {
    const updatedUser = await this.userService.update(dto, id);

    if (updatedUser.length !== 1) {
      throw new HttpException(
        [
          {
            message: [
              'Requested user not found or duplicated - check the user id',
            ],
          },
        ],
        HttpStatus.BAD_REQUEST,
      );
    }

    return res.status(HttpStatus.OK).send();
  }

  private mapUserToResponce({
    email,
    firstname,
    lastname,
    birth_date,
    information,
    id,
    role,
    photo,
  }: User): IUserResponce {
    return {
      email,
      firstname,
      lastname,
      birth_date,
      information,
      id,
      role,
      photo,
    };
  }
}
