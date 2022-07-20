import { BaseFields } from '@core/baseEntity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePaymentDto } from '@paymentsModule/dto/add.dto';
import { Payment } from '@paymentsModule/models/payments.model';
import { CLASSES_FIELD } from '@paymentsModule/types/types';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment) private paymentRepo: typeof Payment) {}

  public create(
    dto: CreatePaymentDto,
    client_id: string,
    classes_amount: number,
  ): Promise<Payment> {
    return this.paymentRepo.create({
      ...dto,
      client_id,
      classes_left: classes_amount,
      ...BaseFields,
    });
  }

  public getAllByUser(id: string): Promise<Payment[]> {
    return this.paymentRepo.findAll({ where: { client_id: id } });
  }

  public getLastByUser(id: string): Promise<Payment> {
    return this.paymentRepo.findOne({
      where: { client_id: id },
    });
  }

  public async decreaseAvailableClasses(id: string): Promise<Payment> {
    return this.paymentRepo.decrement(CLASSES_FIELD, { by: 1, where: { id } });
  }

  public async increaseAvailableClasses(id: string): Promise<Payment> {
    return this.paymentRepo.increment(CLASSES_FIELD, { by: 1, where: { id } });
  }
}
