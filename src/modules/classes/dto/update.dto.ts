import {
  Classes,
  ClassesUk,
  Dto,
  TClass,
  TClassUk,
} from '@classesModule/types/types';
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

  @IsOptional()
  @IsIn([
    ClassesUk.poleExotic,
    ClassesUk.poleSport,
    ClassesUk.stretching,
    ClassesUk.stripPlastic,
  ])
  @ApiProperty({
    example: ClassesUk.stretching,
    description: Dto.nameUkDescription,
  })
  readonly nameUk: TClassUk;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: Dto.descriptionUkExample,
    description: Dto.descriptionUkDescription,
  })
  readonly descriptionUk: string;
}
