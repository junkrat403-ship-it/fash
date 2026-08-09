import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    let rawMessages: string | string[] =
      typeof errorResponse === 'object' && errorResponse !== null && 'message' in errorResponse
        ? (errorResponse as any).message
        : exception instanceof Error
        ? exception.message
        : 'Unexpected error occurred';

    // Clean up raw DTO object path prefixes like "customer.email" => "email"
    const cleanMessage = (msg: string) => {
      return msg
        .replace(/^customer\./i, '')
        .replace(/^shippingAddress\./i, '');
    };

    let formattedMessage = '';
    if (Array.isArray(rawMessages)) {
      formattedMessage = rawMessages.map(cleanMessage).join(', ');
    } else if (typeof rawMessages === 'string') {
      formattedMessage = cleanMessage(rawMessages);
    } else {
      formattedMessage = 'An unexpected error occurred.';
    }

    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - Error: ${formattedMessage}`,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: formattedMessage,
      errors: Array.isArray(rawMessages) ? rawMessages.map(cleanMessage) : [formattedMessage],
    });
  }
}
