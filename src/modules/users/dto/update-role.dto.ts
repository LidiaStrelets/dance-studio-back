import { ApiProperty } from '@nestjs/swagger';
import { Roles, TRoles } from '@core/types';
import { IsIn, IsUUID } from 'class-validator';
import { UUID_EXAMPLE } from '@core/constants';
import { Dto } from '@usersModule/types/types';

export class UpdateRoleDto {
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: Dto.userDescription,
  })
  readonly userId: string;

  @IsIn([Roles.admin, Roles.client, Roles.coach])
  @ApiProperty({
    example: Roles.coach,
    description: Dto.roleDescription,
  })
  readonly role: TRoles;
}
