import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 1,
    description: 'The schedule item unique id',
  })
  readonly schedule_id: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 1,
    description: 'The user unique id',
  })
  readonly client_id: string;
}
