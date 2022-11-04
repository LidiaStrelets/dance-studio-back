import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { RegistrationsService } from '@registrationsModule/services/registrations.service';
import { PaymentsService } from '@paymentsModule/services/payments.service';
import { DAYS_IN_MONTH, NO_LEFT } from '@core/constants';

@Injectable()
export class PaymentAvailableMiddleware {
  constructor(
    private paymentService: PaymentsService,
    private registrationsService: RegistrationsService,
  ) {}

  async use({ body: { client_id } }: Request, _, next: NextFunction) {
    const userPaym = await this.paymentService.getLastByUser(client_id);
    if (!userPaym) {
      throw new HttpException(
        {
          message: 'You should buy a pass to be able to enroll the class!',
        },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    const days = this.registrationsService.convertMilisecondsToDays(
      Date.now() - new Date(userPaym.createdAt).getTime(),
    );

    if (days > DAYS_IN_MONTH || userPaym.available_spots === NO_LEFT) {
      throw new HttpException(
        {
          message:
            'Your pass has ended! Make a new payment to create a registration!',
        },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }
    await this.paymentService.decreaseAvailableClasses(userPaym.id);

    next();
  }
}
