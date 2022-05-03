import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRegistrationDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'The schedule item unique id',
  })
  readonly schedule_id: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'The user unique id',
  })
  readonly client_id: number;
}
