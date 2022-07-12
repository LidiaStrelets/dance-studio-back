import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { CreateDto } from '@rolesModule/dto/add.dto';
import { UpdateDto } from '@rolesModule/dto/update.dto';
import { RolesService } from '@rolesModule/services/roles.service';
import { Role } from '@rolesModule/models/roles.model';
import { IRoleResponce } from '@rolesModule/types/types';
import { RolesGuard } from '@guards/roles.guard';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiOperation({ summary: 'Create user role' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateDto })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user!',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  public async ceate(@Body() dto: CreateDto): Promise<IRoleResponce> {
    const newRole = await this.rolesService.create(dto);

    return this.mapRoleToResponce(newRole);
  }

  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateDto })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user!',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch('/:id')
  public async update(
    @Body() dto: UpdateDto,
    @Param('id') id: string,
  ): Promise<string> {
    const updatedRole = await this.rolesService.update(dto, id);

    return updatedRole ? 'success' : 'error';
  }

  private mapRoleToResponce(role: Role): IRoleResponce {
    return {
      title: role.title,
      description: role.description,
      id: role.id,
    };
  }
}
