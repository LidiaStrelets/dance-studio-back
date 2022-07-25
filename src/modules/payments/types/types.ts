export interface IPaymentResponce {
  classes_left: number;
  price_id: string;
  client_id: string;
  id: string;
}

export const CLASSES_FIELD = 'classes_left';

export enum Paths {
  root = 'Payments',
}
