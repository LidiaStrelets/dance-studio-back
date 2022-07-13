import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const message = exception.message;

    console.log('message', message);

    if (message === 'Validation failed (uuid  is expected)') {
      response.status(status).json({
        statusCode: status,
        message: 'Query parameter is invalid!',
      });
    } else {
      response.status(status).json({
        statusCode: status,
        message: message.join(','),
      });
    }

    console.log('exception caught :', exception);
  }
}
