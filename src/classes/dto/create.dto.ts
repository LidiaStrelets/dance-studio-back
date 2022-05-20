import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @IsIn(['stretching', 'pole sport', 'pole exotic', 'stripplastic'])
  @ApiProperty({
    example: 'stretching',
    description: 'The name of a class',
  })
  readonly name: string;

  @IsString()
  @ApiProperty({
    example: 'Stretching class targets on...',
    description: 'Describes what the class allows',
  })
  readonly description: string;
}
