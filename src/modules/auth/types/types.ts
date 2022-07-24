export interface IToken {
  email: string;
  role: string;
  id: string;
}

export enum Paths {
  login = 'auth/login',
  register = 'auth/registration',
}
