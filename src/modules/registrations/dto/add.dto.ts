import { UUID_EXAMPLE } from '@core/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CreateDto {
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: 'The schedule item unique id',
  })
  readonly schedule_id: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: 'The user unique id',
  })
  readonly client_id: string;
}
