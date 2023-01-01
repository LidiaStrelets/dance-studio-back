export interface IUserResponce {
  email: string;
  firstname: string;
  lastname: string;
  birth_date?: Date;
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
  idExample = '1d51a2a5-d5cd-43d3-a754-1dcbf92aab0d',
  idDescription = 'Unique user id',
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
  birthDateDescription = `User's date of birth`,
  informationExample = 'Some additional information!',
  informationDescription = `Here you can attach some additional information about uuser`,
  keyExample = 'jgvjkb76cghvh',
  keyDescription = `Here you can attach your admin key`,
  photoExample = '18d839b2-102f-44be-a81a-1f5dbf5f0f84-1671977375494.jpeg',
  photoDescription = 'User avatar',
}

export enum Path {
  withId = 'users/:userId',
  root = 'users',
  currentId = 'users/currentId',
  coaches = 'users/coaches',
}
