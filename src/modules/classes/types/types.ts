export interface IClassResponce {
  name: string;
  description: string;
  id: string;
}

export enum Classes {
  stretching = 'stretching',
  poleSport = 'pole sport',
  poleExotic = 'pole exotic',
  stripPlastic = 'stripplastic',
}

export enum ClassesUk {
  stretching = 'розтяжка',
  poleSport = 'пілон спорт',
  poleExotic = 'пілон танець',
  stripPlastic = 'стріппластика',
}

export type TClass =
  | 'stretching'
  | 'pole sport'
  | 'pole exotic'
  | 'stripplastic';

export type TClassUk =
  | 'розтяжка'
  | 'пілон спорт'
  | 'пілон танець'
  | 'стріппластика';

export enum Dto {
  nameDescription = 'The name of a class',
  nameUkDescription = 'Екфтыдфеув name of a class',
  descriptionExample = 'Stretching class targets on...',
  descriptionDescription = 'Describes what the class allows',
  descriptionUkExample = 'Розтяжка - це заняття, спрямоване на...',
  descriptionUkDescription = 'Translated class description',
  idDescription = 'Unique class id',
}

export enum Paths {
  root = 'classes',
}
