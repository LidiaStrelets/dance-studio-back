import { Payment } from '@paymentsModule/models/payments.model';

export interface IPaymentResponce {
  price_id: string;
  user_id: string;
  id: string;
  createdAt: Date;
  available_spots: number;
}

export const CLASSES_FIELD = 'available_spots';

export enum Paths {
  root = 'payments',
  withId = 'payments/:userId',
}

export interface PaymentCreated extends Payment {
  createdAt?: Date;
}

export interface FullPayment {
  available_spots: number;
  price_id: string;
  user_id: string;
}
