import { UUID_EXAMPLE } from '@core/constants';
import { Roles } from '@core/types';

export const RequestService = jest.fn().mockReturnValue({
  setUserId: jest.fn(),
  getUserId: jest.fn().mockReturnValue(UUID_EXAMPLE),
  setUserRole: jest.fn(),
  getUserRole: jest.fn().mockReturnValue(Roles.client),
});
