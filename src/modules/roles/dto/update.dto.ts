import { ApiProperty } from '@nestjs/swagger';
import { TRoles } from '@rolesModule/types/types';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateDto {
  @IsOptional()
  @IsIn(['admin', 'client', 'coach'])
  @ApiProperty({
    example: 'admin',
    description: 'The name of a user role',
  })
  readonly title: TRoles;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'User with the highest rights',
    description: 'Describes what the role allows',
  })
  readonly description: string;
}
