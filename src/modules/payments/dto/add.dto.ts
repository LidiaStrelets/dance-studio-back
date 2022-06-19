import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'The price unique id',
  })
  readonly price_id: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'The user unique id',
  })
  readonly user_id: number;
}
