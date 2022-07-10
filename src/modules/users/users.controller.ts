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
import { UsersService } from '@usersModule/users.service';

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
  @ApiResponse({ status: 200, type: RegisterDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('/:userId')
  async getById(@Param('userId') userId: string) {
    return await this.userService.getById(userId);
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
  @Post('/classes')
  addClass(@Body() dto: AddToUserDto) {
    return this.userService.addClass(dto);
  }

  @ApiOperation({ summary: 'Update schedule' })
  @ApiResponse({ status: 200, type: RegisterDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Patch('/:userId')
  update(@Body() dto: UpdateDto, @Param('userId') id: string) {
    return this.userService.update(dto, Number(id));
  }
}
