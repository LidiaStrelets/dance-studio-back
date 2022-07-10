import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { CreateDto } from '@rolesModule/dto/add.dto';
import { UpdateDto } from '@rolesModule/dto/update.dto';
import { RolesService } from '@rolesModule/roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiOperation({ summary: 'Create user role' })
  @ApiResponse({ status: 200, type: CreateDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Roles('admin')
  @Post()
  async ceate(@Body() dto: CreateDto) {
    return await this.rolesService.create(dto);
  }

  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({ status: 200, type: CreateDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin')
  @Patch('/:id')
  update(@Body() dto: UpdateDto, @Param('id') id: string) {
    return this.rolesService.update(dto, id);
  }
}
