import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuthService } from 'src/auth/auth.service';
import { PricesService } from 'src/prices/prices.service';
import { UsersService } from 'src/users/users.service';
import { CreatePaymentDto } from './dto/add-payment.dto';
import { Payment } from './payments.model';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment) private paymentRepo: typeof Payment,
    private authService: AuthService,
    private priceService: PricesService,
    private userService: UsersService,
  ) {}

  async createPayment(paymentDto: CreatePaymentDto, headers) {
    const userFromToken = this.authService.getUserFromToken(
      headers.authorization,
    );
    if (
      userFromToken.roles?.some((r) => r.title === 'admin') &&
      !paymentDto.user_id
    )
      throw new HttpException(
        { message: 'User id required!' },
        HttpStatus.BAD_REQUEST,
      );

    const price = await this.priceService.getPriceById(
      Number(paymentDto.price_id),
    );

    const client_id = paymentDto.user_id
      ? paymentDto.user_id
      : userFromToken.id;
    const user = await this.userService.getUser(client_id.toString());

    if (!user.roles?.some((r) => r.id === 1))
      throw new HttpException(
        { message: 'Payments can be created only for the clients!' },
        HttpStatus.BAD_REQUEST,
      );

    return await this.paymentRepo.create({
      ...paymentDto,
      client_id,
      classes_left: price.classes_amount,
    });
  }

  async getUserPayments(id: number) {
    return await this.paymentRepo.findAll({ where: { client_id: id } });
  }

  async getLastUserPayment(id: number): Promise<Payment> {
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
