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
import { DataOwnerGuard } from 'src/auth/data-owner.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Class } from 'src/classes/classes.model';
import { AddToUserDto } from 'src/classes/dto/add-to-user.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateDto } from './dto/update.dto';
import { User } from './users.model';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({
    status: 400,
    description: `Impossible to register user with a role. Role doesn't exist!`,
  })
  @ApiResponse({
    status: 400,
    description: `notNull Violation: User.field cannot be null`,
  })
  @Post()
  ceate(@Body() dto: RegisterDto, role: string) {
    return this.userService.registrate(dto, role);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiResponse({ status: 200, type: [User] })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  async getAll() {
    return await this.userService.getAll();
  }

  @ApiOperation({
    summary: 'Get data about one user - allowed to data owner or admin',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(DataOwnerGuard)
  @Get('/:userId')
  async getById(@Param('userId') userId: string) {
    return await this.userService.getById(userId);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiOperation({ summary: 'Add classes to the coach' })
  @ApiResponse({ status: 200, type: Class })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin', 'coach')
  @UseGuards(RolesGuard)
  @Post('/classes')
  addClass(@Body() dto: AddToUserDto) {
    return this.userService.addClass(dto);
  }

  @ApiOperation({ summary: 'Update schedule' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(DataOwnerGuard)
  @Patch('/:id')
  update(@Body() dto: UpdateDto, @Param('id') id: string) {
    return this.userService.update(dto, Number(id));
  }
}
