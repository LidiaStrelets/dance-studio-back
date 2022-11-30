import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { RegistrationsService } from '@registrationsModule/services/registrations.service';
import { RequestService } from '@services/request/request.service';

@Injectable()
export class ExistsRegistrationMiddleware {
  constructor(
    private registrationsService: RegistrationsService,
    private requestService: RequestService,
  ) {}

  async use(
    { body: { client_id: clientId, schedule_id } }: Request,
    _,
    next: NextFunction,
  ) {
    const client_id = clientId || this.requestService.getUserId();
    const registration = await this.registrationsService.getByClientAndSchedule(
      client_id,
      schedule_id,
    );

    if (registration) {
      throw new HttpException(
        { message: 'You already signed for this class!' },
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
