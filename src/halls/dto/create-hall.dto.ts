import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHallDto {
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
}
