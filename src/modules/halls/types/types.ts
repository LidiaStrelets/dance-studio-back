export interface IHallResponce {
  name: string;
  description: string;
  poles_amount: number;
  id: string;
}

export enum Dto {
  nameExample = 'The big hall',
  nameDescription = 'Unique hall name',
  descriptionExample = 'This hall is 60 m^2 squared, includes...',
  descriptionDescription = 'Describes the hall',
  poleAmountExample = 7,
  poleAmountDescription = 'Poles available for the hall',
  idDescription = 'Unique hall id',
}

export enum Paths {
  root = 'halls',
}
