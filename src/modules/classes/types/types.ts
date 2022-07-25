export interface IClassResponce {
  name: string;
  description: string;
  id: string;
}

export enum Classes {
  stretching = 'stretching',
  poleSport = 'pole_sport',
  poleExotic = 'pole_exotic',
  stripPlastic = 'stripplastic',
}

export type TClass =
  | 'stretching'
  | 'pole_sport'
  | 'pole_exotic'
  | 'stripplastic';

export enum Dto {
  nameDescription = 'The name of a class',
  descriptionExample = 'Stretching class targets on...',
  descriptionDescription = 'Describes what the class allows',
  idDescription = 'Unique class id',
}

export enum Paths {
  root = 'classes',
}
