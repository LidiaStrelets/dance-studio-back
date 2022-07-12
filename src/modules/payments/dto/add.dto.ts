import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @ApiProperty({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    description: 'The price unique id',
  })
  readonly price_id: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  @ApiProperty({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    description: 'The user unique id',
  })
  readonly user_id: string;
}
