import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDto } from '@paymentsModule/dto/add.dto';
import { Payment } from '@paymentsModule/payments.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment) private paymentRepo: typeof Payment) {}

  public create(
    dto: CreateDto,
    client_id: string,
    classes_amount: number,
  ): Promise<Payment> {
    const id: string = uuidv4();
    return this.paymentRepo.create({
      ...dto,
      client_id,
      classes_left: classes_amount,
      id,
    });
  }

  public getAllByUser(id: string): Promise<Payment[]> {
    return this.paymentRepo.findAll({ where: { client_id: id } });
  }

  public async getLastByUser(id: string): Promise<Payment> {
    const payments = await this.paymentRepo.findAll({
      where: { client_id: id },
      order: [['createdAt', 'DESC']],
    });
    return payments[0];
  }

  public async decreaseAvailableClasses(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findByPk(id);

    payment.classes_left -= 1;
    await payment.save();
    return payment;
  }

  public async increaseAvailableClasses(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findByPk(id);

    payment.classes_left += 1;
    await payment.save();
    return payment;
  }
}
