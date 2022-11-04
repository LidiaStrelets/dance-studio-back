import { GetId } from '@core/baseEntity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from '@paymentsModule/models/payments.model';
import {
  CLASSES_FIELD,
  FullPayment,
  PaymentCreated,
} from '@paymentsModule/types/types';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment) private paymentRepo: typeof Payment) {}

  public create(dto: FullPayment): Promise<Payment> {
    return this.paymentRepo.create({
      ...dto,
      id: GetId(),
    });
  }

  public getAllByUser(id: string): Promise<PaymentCreated[]> {
    return this.paymentRepo.findAll({ where: { user_id: id } });
  }

  public getLastByUser(id: string): Promise<Payment> {
    return this.paymentRepo.findOne({
      where: { user_id: id },
      order: [['createdAt', 'DESC']],
    });
  }

  public decreaseAvailableClasses(
    id: string,
  ): Promise<[affectedRows: Payment[], affectedCount?: number]> {
    return this.paymentRepo.decrement(CLASSES_FIELD, { by: 1, where: { id } });
  }

  public increaseAvailableClasses(
    id: string,
  ): Promise<[affectedRows: Payment[], affectedCount?: number]> {
    return this.paymentRepo.increment(CLASSES_FIELD, { by: 1, where: { id } });
  }
}
