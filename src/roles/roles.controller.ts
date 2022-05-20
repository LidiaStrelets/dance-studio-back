import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateDto } from './dto/add.dto';
import { UpdateDto } from './dto/update.dto';
import { Role } from './roles.model';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiOperation({ summary: 'Create user role' })
  @ApiResponse({ status: 200, type: Role })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  async ceate(@Body() dto: CreateDto) {
    return await this.rolesService.create(dto);
  }

  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({ status: 200, type: Role })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch('/:id')
  update(@Body() dto: UpdateDto, @Param('id') id: string) {
    return this.rolesService.update(dto, Number(id));
  }
}
