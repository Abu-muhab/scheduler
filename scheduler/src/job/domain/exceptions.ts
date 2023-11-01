import { HttpException, HttpStatus } from '@nestjs/common';

export class RequiredPropertyException extends HttpException {
  constructor(property: string) {
    super(`${property} is required`, HttpStatus.BAD_REQUEST);
  }
}
