import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateHallDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'The big hall',
    description: 'Unique hall name',
  })
  readonly name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'This hall is 60 m^2 squared, includes...',
    description: 'Describes the hall',
  })
  readonly description: string;
}
