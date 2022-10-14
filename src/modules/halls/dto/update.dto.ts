import { Dto } from '@hallsModule/types/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateHallDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: Dto.nameExample,
    description: Dto.nameDescription as string,
  })
  readonly name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: Dto.descriptionExample,
    description: Dto.descriptionDescription as string,
  })
  readonly description: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    example: Dto.poleAmountExample,
    description: Dto.poleAmountDescription as string,
  })
  readonly poles_amount: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: Dto.nameUkExample,
    description: Dto.nameDescription as string,
  })
  readonly nameUk: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: Dto.descriptionUkExample,
    description: Dto.descriptionDescription as string,
  })
  readonly descriptionUk: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: Dto.pictureExample,
    description: Dto.pictureDescription as string,
  })
  readonly picture: string;
}
