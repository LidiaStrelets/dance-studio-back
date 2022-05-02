import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsIn(['admin', 'client', 'coach'])
  @ApiProperty({
    example: 'admin',
    description: 'The name of a user role',
  })
  readonly title: string;

  @IsString()
  @ApiProperty({
    example: 'User with the highest rights',
    description: 'Describes what the role allows',
  })
  readonly description: string;
}
