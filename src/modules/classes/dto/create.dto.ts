import { Classes, TClass } from '@classesModule/types/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';

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
  readonly name: TClass;

  @IsString()
  @ApiProperty({
    example: 'Stretching class targets on...',
    description: 'Describes what the class allows',
  })
  readonly description: string;

  @IsString()
  @IsUUID()
  @ApiProperty({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    description: 'Unique coach id',
  })
  readonly coach: string;
}
