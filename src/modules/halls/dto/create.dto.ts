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

  @IsInt()
  @ApiProperty({
    example: Dto.poleAmountExample,
    description: Dto.poleAmountDescription as string,
  })
  readonly poles_amount: number;
}
