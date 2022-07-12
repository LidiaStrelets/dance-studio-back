import { ApiProperty } from '@nestjs/swagger';
import { Roles, TRoles } from '@rolesModule/types/types';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    description: 'Unique user id',
  })
  readonly userId: string;

  @IsString()
  @IsIn([Roles.admin, Roles.client, Roles.coach])
  @IsNotEmpty()
  @ApiProperty({
    example: 'coach',
    description: 'user role title',
  })
  readonly role: TRoles;
}
