import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { RolesGuard } from '@guards/roles.guard';
import { RegisterDto } from '@usersModule/dto/register.dto';
import { UpdateDto } from '@usersModule/dto/update.dto';
import { UsersService } from '@usersModule/services/users.service';
import { User } from '@usersModule/models/users.model';
import {
  IUserResponce,
  IUserWithRolesResponce,
} from '@usersModule/types/types';
import { UpdateRoleDto } from '@usersModule/dto/update-role.dto';
import { BodyValidPipe } from '@usersModule/pipes/bodyValid.pipe';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [RegisterDto] })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user!',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
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
  @ApiResponse({ status: HttpStatus.OK, type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user!',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Get('/:userId')
  @Roles('admin', 'client')
  @UseGuards(RolesGuard)
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
  @ApiResponse({ status: HttpStatus.OK, type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user!',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch('/updateRole')
  public async updateRole(@Body() dto: UpdateRoleDto): Promise<string> {
    const updatedUser = await this.userService.updateRole(dto);

    return updatedUser ? 'success' : 'error';
  }

  @ApiOperation({ summary: 'Update schedule' })
  @ApiResponse({ status: HttpStatus.OK, type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user!',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Roles('admin', 'client')
  @UseGuards(RolesGuard)
  @Patch('/:userId')
  public async update(
    @Body(BodyValidPipe) dto: UpdateDto,
    @Param('userId', ParseUUIDPipe) id: string,
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
      role: user.role,
    };
  }
}
