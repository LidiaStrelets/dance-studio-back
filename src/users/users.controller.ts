import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataOwnerGuard } from 'src/auth/data-owner.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { RegisterUserDto } from './dto/register-user.dto';
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
  ceateUser(@Body() userDto: RegisterUserDto, role: string) {
    return this.userService.registrateUser(userDto, role);
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
  getUsers() {
    return this.userService.getUsers();
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
  getUser(@Param('userId') userId: string) {
    return this.userService.getUser(userId);
  }
}
