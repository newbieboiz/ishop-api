import { HttpStatusCodes } from './constants';

export class HttpException extends Error {
  constructor(message: string, status: number, name: string) {
    super(name);

    Object.assign(this, {
      name,
      message,
      status,
    });
    Error.captureStackTrace(this);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string, name = 'Bad request') {
    super(message, HttpStatusCodes.BAD_REQUEST, name);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string, name = 'Unauthorized') {
    super(message, HttpStatusCodes.UNAUTHORIZED, name);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = '', name = 'Forbidden') {
    super(message, HttpStatusCodes.FORBIDDEN, name);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = '', name = 'Not found') {
    super(message, HttpStatusCodes.NOT_FOUND, name);
  }
}

export class MethodNotAllowedException extends HttpException {
  constructor(message = '', name = 'Not allowed') {
    super(message, HttpStatusCodes.METHOD_NOT_ALLOWED, name);
  }
}

export class InternalServerException extends HttpException {
  constructor(message = '', name = 'Internal Server Error') {
    super(message, HttpStatusCodes.INTERNAL_SERVER_ERROR, name);
  }
}
