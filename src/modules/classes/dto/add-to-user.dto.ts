import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AddToUserDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    example: '1',
    description: 'Coach class id',
  })
  readonly class: number;

  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'Unique coach id',
  })
  readonly user_id: number;
}
