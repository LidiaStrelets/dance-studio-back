export interface IUserResponce {
  email: string;
  firstname: string;
  lastname: string;
  birth_date?: string;
  information?: string;
  id: string;
  role: string;
  photo?: string;
}

export enum EUpdateUser {
  firstname,
  lastname,
  birth_date,
  information,
  photo,
  email,
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
  dateExample = '12-12-2021',
}

export enum Path {
  withId = 'users/:userId',
  root = 'users',
  currentId = 'users/currentId',
  coaches = 'users/coaches',
}
