import { BaseEntity } from '@core/baseEntity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateHallDto extends BaseEntity {
  @IsString()
  @ApiProperty({
    example: 'The big hall',
    description: 'Unique hall name',
  })
  readonly name: string;

  @IsString()
  @ApiProperty({
    example: 'This hall is 60 m^2 squared, includes...',
    description: 'Describes the hall',
  })
  readonly description: string;

  @IsInt()
  @ApiProperty({
    example: 9,
    description: 'Poles available for the hall',
  })
  readonly poles_amount: number;
}
