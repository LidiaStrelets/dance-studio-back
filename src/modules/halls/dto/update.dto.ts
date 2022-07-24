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
}
