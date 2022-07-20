import { UUID_EXAMPLE } from '@core/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseEntity {
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: 'Unique item id',
  })
  readonly id: string;
}

export const BaseFields = {
  id: uuidv4(),
};
