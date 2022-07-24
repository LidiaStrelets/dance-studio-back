import { UUID_EXAMPLE } from '@core/constants';
import { Roles } from '@core/types';
import { UpdateRoleDto } from '@usersModule/dto/update-role.dto';

export const updateRoleData = (): UpdateRoleDto => ({
  userId: UUID_EXAMPLE,
  role: Roles.client,
});
