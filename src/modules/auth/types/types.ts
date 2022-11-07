import { TRoles } from '@core/types';

export interface IToken {
  email: string;
  role: TRoles;
  id: string;
}

export interface ITokenData {
  role: TRoles;
  id: string;
}

export enum Paths {
  login = 'auth/login',
  register = 'auth/registration',
}
