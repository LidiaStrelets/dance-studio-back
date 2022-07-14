import { DateDataType } from 'sequelize/types';

export interface IUserResponce {
  email: string;
  firstname: string;
  lastname: string;
  birth_date: DateDataType | null;
  information: string | null;
  id: string;
  role: string;
}

export enum EUpdateUser {
  firstname,
  lastname,
  birth_date,
  information,
}
