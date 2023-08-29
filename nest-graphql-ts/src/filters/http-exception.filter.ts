import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const logFormat = `Request original url: ${request.originalUrl} Method: ${request.method} IP: ${request.ip} Status code: ${status} Response: ${exception.toString()}`;
    console.info(logFormat);

    const message = exception.message ? exception.message : `${status >= 500 ? 'Service Error' : 'Client Error'}`;
    const errorResponse = {
      statusCode: status,
      data: { error: message },
      message: '',
      code: 1,
      url: request.originalUrl,
    };
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
