import { UUID_EXAMPLE } from '@core/constants';
import { Roles } from '@core/types';
import { User } from '@usersModule/models/users.model';
import { Dto } from '@usersModule/types/types';
import sequelize from 'sequelize';
import * as SequelizeMock from 'sequelize-mock';
import { createUserData } from '@usersModule/test/data/createUser.data';

const DBConnectionMock = new SequelizeMock();

export const UserMock = DBConnectionMock.define(
  'users',
  {
    id: UUID_EXAMPLE,
    email: Dto.emailExample,
    password: Dto.passwordExample,
    firstname: Dto.nameExample,
    lastname: Dto.lastNameExample,
    birth_date: Dto.dateExample,
    information: Dto.informationExample,
    role: Roles.client,
  },
  { timestamps: false },
);

UserMock.findByPk = function (id: string) {
  return {
    ...createUserData(),
    id,
  };
};
