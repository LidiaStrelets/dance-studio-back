export interface IPriceResponce {
  classes_amount: number;
  price: number;
  id: string;
}

export enum Dto {
  priceIdDescription = 'The price unique id',
  classesAmountExample = 8,
  classesAmountDescription = 'The classes amount, if equals to 100 means thas pass is unlimites',
  priceExample = 1200.0,
  priceDescription = 'The price of classes',
}

export enum Paths {
  root = 'prices',
}
