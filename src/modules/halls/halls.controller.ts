import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { CreateDto } from '@hallsModule/dto/create.dto';
import { UpdateDto } from '@hallsModule/dto/update.dto';
import { HallsService } from '@hallsModule/halls.service';

@ApiTags('Halls')
@Controller('halls')
export class HallsController {
  constructor(private hallService: HallsService) {}

  @ApiOperation({ summary: 'Create hall' })
  @ApiResponse({ status: 200, type: CreateDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin')
  @Post()
  async ceate(@Body() вto: CreateDto) {
    return await this.hallService.create(вto);
  }

  @ApiOperation({ summary: 'Update hall' })
  @ApiResponse({ status: 200, type: CreateDto })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('admin')
  @Patch('/:id')
  update(@Body() вto: UpdateDto, @Param('id') id: string) {
    return this.hallService.update(вto, Number(id));
  }
}
