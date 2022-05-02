import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'admin',
    description: 'The name of a user role',
  })
  readonly title: string;

  @ApiProperty({
    example: 'User with the highest rights',
    description: 'Describes what the role allows',
  })
  readonly description: string;
}
