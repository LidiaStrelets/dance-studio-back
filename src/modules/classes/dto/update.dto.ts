import { Classes, Dto, TClass } from '@classesModule/types/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateClassDto {
  @IsOptional()
  @IsIn([
    Classes.poleExotic,
    Classes.poleSport,
    Classes.stretching,
    Classes.stripPlastic,
  ])
  @ApiProperty({
    example: Classes.stretching,
    description: Dto.nameDescription,
  })
  readonly name: TClass;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: Dto.descriptionExample,
    description: Dto.descriptionDescription,
  })
  readonly description: string;
}
