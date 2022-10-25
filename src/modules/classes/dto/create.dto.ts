import {
  Classes,
  ClassesUk,
  Dto,
  TClass,
  TClassUk,
} from '@classesModule/types/types';
import { BaseEntity } from '@core/baseEntity';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class CreateClassDto extends BaseEntity {
  @IsIn([
    Classes.poleExotic,
    Classes.poleSport,
    Classes.stretching,
    Classes.stripPlastic,
    Classes.exoticBeginners,
  ])
  @ApiProperty({
    example: Classes.stretching,
    description: Dto.nameDescription,
  })
  readonly name: TClass;

  @IsString()
  @ApiProperty({
    example: Dto.descriptionExample,
    description: Dto.descriptionDescription,
  })
  readonly description: string;

  @IsIn([
    ClassesUk.poleExotic,
    ClassesUk.poleSport,
    ClassesUk.stretching,
    ClassesUk.stripPlastic,
    ClassesUk.exoticBeginners,
  ])
  @ApiProperty({
    example: ClassesUk.stretching,
    description: Dto.nameUkDescription,
  })
  readonly nameUk: TClassUk;

  @IsString()
  @ApiProperty({
    example: Dto.descriptionUkExample,
    description: Dto.descriptionUkDescription,
  })
  readonly descriptionUk: string;
}
