import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateDto {
  @IsOptional()
  @IsIn(['stretching', 'pole sport', 'pole exotic', 'stripplastic'])
  @ApiProperty({
    example: 'stretching',
    description: 'The name of a class',
  })
  readonly name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Stretching class targets on...',
    description: 'Describes what the class allows',
  })
  readonly description: string;
}
