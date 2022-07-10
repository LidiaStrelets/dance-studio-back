import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDto } from '@paymentsModule/dto/add.dto';
import { Payment } from '@paymentsModule/payments.model';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment) private paymentRepo: typeof Payment) {}

  async create(dto: CreateDto, client_id: number, classes_amount: number) {
    return this.paymentRepo.create({
      ...dto,
      client_id,
      classes_left: classes_amount,
    });
  }

  async getAllByUser(id: number) {
    return this.paymentRepo.findAll({ where: { client_id: id } });
  }

  async getLastByUser(id: number): Promise<Payment> {
    const payments = await this.paymentRepo.findAll({
      where: { client_id: id },
      order: [['createdAt', 'DESC']],
    });
    return payments[0];
  }

  async decreaseAvailableClasses(id: number) {
    const payment = await this.paymentRepo.findOne({ where: { id } });

    payment.classes_left -= 1;
    await payment.save();
    return payment;
  }

  async increaseAvailableClasses(id: number) {
    const payment = await this.paymentRepo.findOne({ where: { id } });

    payment.classes_left += 1;
    await payment.save();
    return payment;
  }
}
