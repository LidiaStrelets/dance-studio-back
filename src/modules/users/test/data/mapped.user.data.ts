import { UUID_EXAMPLE } from '@core/constants';
import { Roles } from '@core/types';
import { User } from '@usersModule/models/users.model';
import { Dto } from '@usersModule/types/types';
import sequelize from 'sequelize';

export const mappedUserData = (): User =>
  ({
    id: UUID_EXAMPLE,
    email: Dto.emailExample,
    firstname: Dto.nameExample,
    lastname: Dto.lastNameExample,
    birth_date: new sequelize.DATE(),
    information: Dto.informationExample,
    role: Roles.client,
  } as User);
