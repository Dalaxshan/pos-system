import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

interface ErrorResponse {
  statusCode: number;
  errorDetails?: any;
  userMessage: string;
  path: string;
  timestamp: string;
}

@Catch(HttpException, MongooseError)
export class CombinedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CombinedExceptionFilter.name);

  catch(exception: HttpException | MongooseError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let userMessage: string;
    let errorDetails: any;

    if (exception instanceof MongooseError.CastError) {
      status = 400;
      userMessage = 'Invalid data. Please check your input and try again.';
      errorDetails = { field: exception.path, value: exception.value, message: exception.message };
    } else if (exception instanceof MongooseError.ValidationError) {
      status = 400;
      userMessage = 'Validation failed. Please check your input.';

      // Collect detailed error messages for each invalid field
      errorDetails = Object.values(exception.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
    } else if (exception instanceof MongooseError.DocumentNotFoundError) {
      status = 404;
      userMessage = 'Resource not found. Please check the URL and try again.';
    } else if (exception instanceof MongooseError) {
      status = 500;
      userMessage = 'Database error. Please try again later.';
    } else {
      // Handle other HttpExceptions
      status = (exception as HttpException).getStatus();
      userMessage = this.getUserFriendlyMessage(status);

      // Include error details from HttpException if available
      const responseBody = (exception as HttpException).getResponse() as any;
      errorDetails = typeof responseBody === 'object' ? responseBody.message : responseBody;
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      errorDetails,
      userMessage: userMessage,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    this.logger.error(
      `${request.method} ${request.originalUrl} - ${status}: ${exception.message} ${errorDetails ? JSON.stringify(errorDetails, null, 2) : ''}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }

  private getUserFriendlyMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Unauthorized access. Please log in and try again.';
      case 403:
        return 'Forbidden. You do not have the necessary permissions.';
      case 404:
        return 'Resource not found. Please check the URL and try again.';
      case 409:
        return 'Same details are already in use. Please check and try again.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  }
}
