import { DateDataType } from 'sequelize/types';

export interface IUserResponce {
  email: string;
  firstname: string;
  lastname: string;
  birth_date: DateDataType | null;
  information: string | null;
  id: string;
}

export interface IUserWithRolesResponce extends IUserResponce {
  roles: string[];
}
