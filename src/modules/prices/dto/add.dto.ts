import { BaseEntity } from '@core/baseEntity';
import { ApiProperty } from '@nestjs/swagger';
import { Dto } from '@pricesModule/types/types';
import { IsInt, IsNumber } from 'class-validator';

export class CreatePriceDto extends BaseEntity {
  @IsInt()
  @ApiProperty({
    example: Dto.classesAmountExample,
    description: Dto.classesAmountDescription as string,
  })
  readonly classes_amount: number;

  @IsNumber()
  @ApiProperty({
    example: Dto.priceExample,
    description: Dto.priceDescription as string,
  })
  readonly price: number;
}
