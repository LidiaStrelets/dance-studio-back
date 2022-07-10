import { Classes } from '@classesModule/types/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @IsIn([
    Classes.poleExotic,
    Classes.poleSport,
    Classes.stretching,
    Classes.stripPlastic,
  ])
  @ApiProperty({
    example: Classes.stretching,
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
