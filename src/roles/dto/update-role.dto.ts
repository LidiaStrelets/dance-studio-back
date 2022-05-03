import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsIn(['admin', 'client', 'coach'])
  @ApiProperty({
    example: 'admin',
    description: 'The name of a user role',
  })
  readonly title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'User with the highest rights',
    description: 'Describes what the role allows',
  })
  readonly description: string;
}
