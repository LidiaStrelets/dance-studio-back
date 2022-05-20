import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    example: 8,
    description:
      'The classes amount, if equals to 100 means thas pass is unlimites',
  })
  readonly classes_amount: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1200.0,
    description: 'The price of classes',
  })
  readonly price: number;
}
