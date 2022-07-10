import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDto } from '@paymentsModule/dto/add.dto';
import { Payment } from '@paymentsModule/payments.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment) private paymentRepo: typeof Payment) {}

  create(dto: CreateDto, client_id: string, classes_amount: number) {
    const id: string = uuidv4();
    return this.paymentRepo.create({
      ...dto,
      client_id,
      classes_left: classes_amount,
      id,
    });
  }

  getAllByUser(id: string) {
    return this.paymentRepo.findAll({ where: { client_id: id } });
  }

  async getLastByUser(id: string): Promise<Payment> {
    const payments = await this.paymentRepo.findAll({
      where: { client_id: id },
      order: [['createdAt', 'DESC']],
    });
    return payments[0];
  }

  async decreaseAvailableClasses(id: string) {
    const payment = await this.paymentRepo.findByPk(id);

    payment.classes_left -= 1;
    await payment.save();
    return payment;
  }

  async increaseAvailableClasses(id: string) {
    const payment = await this.paymentRepo.findByPk(id);

    payment.classes_left += 1;
    await payment.save();
    return payment;
  }
}
