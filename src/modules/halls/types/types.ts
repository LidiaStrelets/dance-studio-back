export interface IHallResponce {
  name: string;
  description: string;
  nameUk: string;
  descriptionUk: string;
  poles_amount: number;
  id: string;
  picture: string;
}

export enum Dto {
  nameExample = 'The big hall',
  nameDescription = 'Unique hall name',
  descriptionExample = 'This hall is 60 m^2 squared, includes...',
  descriptionDescription = 'Describes the hall',
  nameUkExample = 'Великий зал',
  descriptionUkExample = 'Цей зал має 10 пілонівб великі дзеркала на всіх стінах???',
  pictureExample = 'https://cdn3.vectorstock.com/i/1000x1000/83/02/exotic-pole-dance-vector-15988302.jpg',
  pictureDescription = 'A link to a picture of a hall',
  poleAmountExample = 7,
  poleAmountDescription = 'Poles available for the hall',
  idDescription = 'Unique hall id',
}

export enum Paths {
  root = 'halls',
}
