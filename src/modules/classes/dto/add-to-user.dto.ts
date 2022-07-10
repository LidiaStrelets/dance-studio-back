import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AddToUserDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    description: 'Coach class id',
  })
  readonly class: string;

  @IsInt()
  @ApiProperty({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    description: 'Unique coach id',
  })
  readonly user_id: string;
}
