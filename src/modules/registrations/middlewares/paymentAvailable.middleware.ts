import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RegistrationsService } from '@registrationsModule/services/registrations.service';
import { RequestService } from '@services/request.service';
import { PaymentsService } from '@paymentsModule/services/payments.service';

@Injectable()
export class PaymentAvailableMiddleware {
  constructor(
    private paymentService: PaymentsService,
    private requestService: RequestService,
    private registrationsService: RegistrationsService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userPaym = await this.paymentService.getLastByUser(
      req.body.client_id || this.requestService.getUserId(),
    );

    const days = this.registrationsService.convertMilisecondsToDays(
      Date.now() - new Date(userPaym.createdAt).getTime(),
    );

    if (days > 30 || userPaym.classes_left === 0) {
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
