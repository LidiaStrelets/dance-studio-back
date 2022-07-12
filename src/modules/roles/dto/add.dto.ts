import { ApiProperty } from '@nestjs/swagger';
import { TRoles } from '@rolesModule/types/types';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @IsIn(['admin', 'client', 'coach'])
  @ApiProperty({
    example: 'admin',
    description: 'The name of a user role',
  })
  readonly title: TRoles;

  @IsString()
  @ApiProperty({
    example: 'User with the highest rights',
    description: 'Describes what the role allows',
  })
  readonly description: string;
}
