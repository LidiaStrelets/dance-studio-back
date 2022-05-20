import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'The big hall',
    description: 'Unique hall name',
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'This hall is 60 m^2 squared, includes...',
    description: 'Describes the hall',
  })
  readonly description: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    example: 9,
    description: 'Poles available for the hall',
  })
  readonly poles_amount: number;
}