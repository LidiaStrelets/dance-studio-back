import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/roles.decorator';
import { DataOwnerGuard } from 'src/core/guards/data-owner.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Class } from 'src/modules/classes/classes.model';
import { AddToUserDto } from 'src/modules/classes/dto/add-to-user.dto';
import { Role } from '../roles/roles.model';
import { RolesService } from '../roles/roles.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateDto } from './dto/update.dto';
import { User } from './users.model';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private readonly rolesService: RolesService,
    @Inject('CoreJwtService')
    private readonly jwtService: JwtService,
  ) {}

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
  async create(@Body() dto: RegisterDto, role: string) {
    const roleObj = await this.rolesService.getByTitle(role);
    return this.userService.registrate(dto, roleObj);
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

  // @ApiHeader({
  //   name: 'Authorization',
  //   description: 'Bearer token',
  // })
  // @ApiOperation({ summary: 'Add classes to the coach' })
  // @ApiResponse({ status: 200, type: Class })
  // @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @Roles('admin', 'coach')
  // @Post('/classes')
  // addClass(@Body() dto: AddToUserDto) {
  //   return this.userService.addClass(dto);
  // }

  @ApiOperation({ summary: 'Update schedule' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Patch('/:id')
  update(@Body() dto: UpdateDto, @Param('id') id: string) {
    return this.userService.update(dto, Number(id));
  }
}
