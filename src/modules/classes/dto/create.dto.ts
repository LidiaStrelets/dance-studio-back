import { Classes, TClass } from '@classesModule/types/types';
import { UUID_EXAMPLE } from '@core/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsUUID } from 'class-validator';

export class CreateDto {
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

  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: 'Unique coach id',
  })
  readonly coach: string;
}
