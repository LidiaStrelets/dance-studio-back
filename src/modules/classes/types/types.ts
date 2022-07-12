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
