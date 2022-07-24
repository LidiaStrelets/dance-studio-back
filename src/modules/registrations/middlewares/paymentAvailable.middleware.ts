import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { RegistrationsService } from '@registrationsModule/services/registrations.service';
import { RequestService } from '@services/request.service';
import { PaymentsService } from '@paymentsModule/services/payments.service';
import { DAYS_IN_MONTH, NO_LEFT } from '@core/constants';

@Injectable()
export class PaymentAvailableMiddleware {
  constructor(
    private paymentService: PaymentsService,
    private requestService: RequestService,
    private registrationsService: RegistrationsService,
  ) {}

  async use({ body: { client_id } }: Request, _, next: NextFunction) {
    const userPaym = await this.paymentService.getLastByUser(
      client_id || this.requestService.getUserId(),
    );

    const days = this.registrationsService.convertMilisecondsToDays(
      Date.now() - new Date(userPaym.createdAt).getTime(),
    );

    if (days > DAYS_IN_MONTH || userPaym.classes_left === NO_LEFT) {
      throw new HttpException(
        {
          message:
            'Your pass has ended! Make a new payment to create a registration!',
        },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }
    next();
  }
}
