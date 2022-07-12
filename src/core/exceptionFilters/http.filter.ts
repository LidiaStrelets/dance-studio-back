import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const message = exception.message;

    if (message === 'Validation failed (uuid  is expected)') {
      response.status(status).json({
        statusCode: status,
        message: 'Query parameter is invalid!',
      });
    }

    response.status(status).json({
      statusCode: status,
      message,
    });

    console.log('exception caught :', {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
