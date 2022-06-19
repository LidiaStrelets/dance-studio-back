import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuthService } from 'src/modules/auth/auth.service';
import { PricesService } from 'src/modules/prices/prices.service';
import { UsersService } from 'src/modules/users/users.service';
import { CreateDto } from './dto/add.dto';
import { Payment } from './payments.model';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment) private paymentRepo: typeof Payment,
    private authService: AuthService,
    private priceService: PricesService,
    private userService: UsersService,
  ) {}

  // async create(dto: CreateDto, headers) {
  //   const userFromToken = this.authService.getUserFromToken(
  //     headers.authorization,
  //   );
  //   if (userFromToken.roles?.some((r) => r.title === 'admin') && !dto.user_id)
  //     throw new HttpException(
  //       { message: 'User id required!' },
  //       HttpStatus.BAD_REQUEST,
  //     );

  //   const price = await this.priceService.getById(Number(dto.price_id));

  //   const client_id = dto.user_id ? dto.user_id : userFromToken.id;
  //   const user = await this.userService.getById(client_id.toString());

  //   if (!user.roles?.some((r) => r.id === 1))
  //     throw new HttpException(
  //       { message: 'Payments can be created only for the clients!' },
  //       HttpStatus.BAD_REQUEST,
  //     );

  //   return this.paymentRepo.create({
  //     ...dto,
  //     client_id,
  //     classes_left: price.classes_amount,
  //   });
  // }

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
