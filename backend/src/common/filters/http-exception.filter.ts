// --- Import Thư Viện NestJS ---
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

interface HttpExceptionResponse {
  message?: string | string[];
  errorCode?: string;
}

interface ErrorWithStatus {
  status?: number;
  type?: string;
  message?: string;
}

// --- Định Nghĩa Bộ Lọc Lỗi Chuẩn Hóa Phản Hồi ---
@Catch() // Bắt TẤT CẢ các lỗi (bao gồm cả PayloadTooLargeError từ body-parser)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Xử lý lỗi HTTP và chuẩn hoá định dạng phản hồi lỗi
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: ExpressResponse = ctx.getResponse();
    const request: ExpressRequest = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Lỗi không xác định';
    let errorCode = 'UNEXPECTED_ERROR';
    let extraData = {};

    // Safe casting for property access
    const errorAny = exception as ErrorWithStatus;

    // Ưu tiên lấy status từ exception nếu có (Duck Typing để tránh lỗi instance check)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else if (errorAny?.status) {
      status = errorAny.status;
    } else if ((exception as Record<string, any>)?.statusCode) {
      status = (exception as Record<string, any>).statusCode as number;
    }

    if (exception instanceof HttpException) {
      // 1. Xử lý lỗi từ NestJS HttpException
      const exceptionResponse = exception.getResponse() as HttpExceptionResponse | string;

      if (typeof exceptionResponse !== 'string' && Array.isArray(exceptionResponse.message)) {
        message = exceptionResponse.message.join(', ');
      } else if (
        typeof exceptionResponse !== 'string' &&
        typeof exceptionResponse.message === 'string'
      ) {
        message = exceptionResponse.message;
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }

      if (typeof exceptionResponse !== 'string' && exceptionResponse?.errorCode) {
        errorCode = exceptionResponse.errorCode;
      }

      if (typeof exceptionResponse === 'object') {
        extraData = exceptionResponse;
      }
    } else if (
      // 2. Xử lý lỗi PayloadTooLargeError (body-parser)
      errorAny?.type === 'entity.too.large' ||
      status === HttpStatus.PAYLOAD_TOO_LARGE
    ) {
      status = HttpStatus.PAYLOAD_TOO_LARGE;
      message = 'Payload Too Large: File upload kích thước quá lớn (Max: 20MB).';
      errorCode = 'PAYLOAD_TOO_LARGE';
      // Không log stack trace, chỉ log warning nhẹ
      console.warn(`⚠️ [Security] Blocked Large Payload (>20MB). IP: ${request.ip}`);
    } else {
      // 3. Lỗi Server lạ (In stack trace để debug)
      console.error('❌ [System] Uncaught Exception:', exception);
    }

    // Gửi phản hồi lỗi chuẩn về phía client
    const responseBody = {
      message,
      data: null,
      errorCode,
      ...extraData,
    };

    response.status(status).json(responseBody);
  }
}
