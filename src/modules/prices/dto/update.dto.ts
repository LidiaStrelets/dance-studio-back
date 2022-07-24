import { ApiProperty } from '@nestjs/swagger';
import { Dto } from '@pricesModule/types/types';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class UpdatePriceDto {
  @IsOptional()
  @IsInt()
  @ApiProperty({
    example: Dto.classesAmountExample,
    description: Dto.classesAmountDescription as string,
  })
  readonly classes_amount: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: Dto.priceExample,
    description: Dto.priceDescription as string,
  })
  readonly price: number;
}
