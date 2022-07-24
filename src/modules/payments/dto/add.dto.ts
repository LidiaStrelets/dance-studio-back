import { BaseEntity } from '@core/baseEntity';
import { UUID_EXAMPLE } from '@core/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { Dto as UsersDto } from '@usersModule/types/types';
import { Dto as PricesDto } from '@pricesModule/types/types';

export class CreatePaymentDto extends BaseEntity {
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: PricesDto.priceIdDescription as string,
  })
  readonly price_id: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: UsersDto.clientDescription,
  })
  readonly user_id: string;
}
