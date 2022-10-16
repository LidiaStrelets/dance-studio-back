import { Roles } from '@core/types';
import { User } from '@usersModule/models/users.model';
import { Dto } from '@usersModule/types/types';

export const createUserData = (): User =>
  ({
    email: Dto.emailExample,
    firstname: Dto.nameExample,
    lastname: Dto.lastNameExample,
    password: Dto.passwordExample,
    birth_date: Dto.dateExample,
    information: Dto.informationExample,
    role: Roles.client,
  } as User);
