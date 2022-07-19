import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class UpdatePriceDto {
  @IsOptional()
  @IsInt()
  @ApiProperty({
    example: 8,
    description:
      'The classes amount, if equals to 100 means thas pass is unlimites',
  })
  readonly classes_amount: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 1200.0,
    description: 'The price of classes',
  })
  readonly price: number;
}
