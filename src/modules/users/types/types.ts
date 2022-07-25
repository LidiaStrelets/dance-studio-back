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

export enum Dto {
  coachDescription = 'Unique coach id',
  clientDescription = 'The client unique id',
  userDescription = 'Unique user id',
  emailExample = 'my-email@gmail.com',
  emailDescription = 'Unique user email',
  passwordExample = 'qwerty235!',
  passwordDescription = 'Password',
  nameExample = 'Anna',
  nameDescription = 'User name',
  lastNameExample = 'Ivanova',
  lastNameDescription = 'User lastname',
  roleDescription = 'User role',
  birthDateExample = '29.07.1996',
  birthDateDescription = `User's date of birth`,
  informationExample = 'Want to visit classes every day!',
  informationDescription = `Here you can attach some additional information about uuser`,
  keyExample = 'jgvjkb76cghvh',
  keyDescription = `Here you can attach your admin key`,
}

export enum Path {
  withId = 'users/:userId',
  root = 'users',
}
