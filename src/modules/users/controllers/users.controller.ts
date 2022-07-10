import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { RolesGuard } from '@guards/roles.guard';
import { AddToUserDto } from '@classesModule/dto/add-to-user.dto';
import { RegisterDto } from '@usersModule/dto/register.dto';
import { UpdateDto } from '@usersModule/dto/update.dto';
import { UsersService } from '@usersModule/services/users.service';
import { User } from '@usersModule/models/users.model';
import {
  IUserResponce,
  IUserWithRolesResponce,
} from '@usersModule/types/types';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiResponse({ status: 200, type: [RegisterDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  public async getAll(): Promise<IUserWithRolesResponce[]> {
    const users = await this.userService.getAll();
    return users.map((user) => this.mapUserWithRolesToResponce(user));
  }

  @ApiOperation({
    summary: 'Get data about one user - allowed to data owner or admin',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiResponse({ status: 200, type: RegisterDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('/:userId')
  public async getById(
    @Param('userId') userId: string,
  ): Promise<IUserWithRolesResponce> {
    const user = await this.userService.getById(userId);
    return this.mapUserWithRolesToResponce(user);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiOperation({ summary: 'Add classes to the coach' })
  @ApiResponse({ status: 200, type: RegisterDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin', 'coach')
  @UseGuards(RolesGuard)
  @Post('/classes')
  public async addClass(@Body() dto: AddToUserDto): Promise<string> {
    const updatedUser = await this.userService.addClass(dto);

    return updatedUser ? 'success' : 'error';
  }

  @ApiOperation({ summary: 'Update schedule' })
  @ApiResponse({ status: 200, type: RegisterDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Patch('/:userId')
  public async update(
    @Body() dto: UpdateDto,
    @Param('userId') id: string,
  ): Promise<string> {
    const updatedUser = await this.userService.update(dto, id);

    return updatedUser ? 'success' : 'error';
  }

  private mapUserToResponce(user: User): IUserResponce {
    return {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      birth_date: user.birth_date,
      information: user.information,
      id: user.id,
    };
  }

  private mapUserWithRolesToResponce(user: User): IUserWithRolesResponce {
    return {
      ...this.mapUserToResponce(user),
      roles: user.roles.map((role) => role.title),
    };
  }
}
