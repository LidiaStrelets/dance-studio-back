import { userData } from '@usersModule/test/data/user.data';

export const UsersService = jest.fn().mockReturnValue({
  registrate: jest.fn().mockReturnValue(userData()),
  updateRole: jest.fn().mockReturnValue([1]),
  findByEmail: jest.fn().mockReturnValue(userData()),
  getAll: jest.fn().mockReturnValue([userData()]),
  getById: jest.fn().mockReturnValue(userData()),
  isCoach: jest.fn().mockReturnValue(true),
  update: jest.fn().mockReturnValue([5]),
});
