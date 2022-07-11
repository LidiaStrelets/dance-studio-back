import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RegistrationsService } from '@registrationsModule/services/registrations.service';
import { RequestService } from '@services/request.service';

@Injectable()
export class ExistsRegistrationMiddleware {
  constructor(
    private registrationsService: RegistrationsService,
    private requestService: RequestService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const client_id = req.body.client_id || this.requestService.getUserId();
    const registration = await this.registrationsService.find(
      client_id,
      req.body.schedule_id,
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
