import { BaseEntity } from '@core/baseEntity';
import { Dto } from '@hallsModule/types/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateHallDto extends BaseEntity {
  @IsString()
  @ApiProperty({
    example: Dto.nameExample,
    description: Dto.nameDescription as string,
  })
  readonly name: string;

  @IsString()
  @ApiProperty({
    example: Dto.descriptionExample,
    description: Dto.descriptionDescription as string,
  })
  readonly description: string;

  @IsString()
  @ApiProperty({
    example: Dto.nameUkExample,
    description: Dto.nameDescription as string,
  })
  readonly nameUk: string;

  @IsString()
  @ApiProperty({
    example: Dto.descriptionUkExample,
    description: Dto.descriptionDescription as string,
  })
  readonly descriptionUk: string;

  @IsString()
  @ApiProperty({
    example: Dto.pictureExample,
    description: Dto.pictureDescription as string,
  })
  readonly picture: string;

  @IsInt()
  @ApiProperty({
    example: Dto.poleAmountExample,
    description: Dto.poleAmountDescription as string,
  })
  readonly poles_amount: number;
}
