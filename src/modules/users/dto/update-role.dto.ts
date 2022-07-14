import { ApiProperty } from '@nestjs/swagger';
import { Roles, TRoles } from '@core/types';
import { IsIn, IsUUID } from 'class-validator';
import { UUID_EXAMPLE } from '@core/constants';

export class UpdateRoleDto {
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: 'Unique user id',
  })
  readonly userId: string;

  @IsIn([Roles.admin, Roles.client, Roles.coach])
  @ApiProperty({
    example: Roles.coach,
    description: 'user role title',
  })
  readonly role: TRoles;
}
