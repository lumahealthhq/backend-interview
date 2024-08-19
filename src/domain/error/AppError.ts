export default class AppError {
  message: string;
  code: number;
  details?: unknown;

  constructor(message: string, code: number, details?: unknown) {
    this.message = message
    this.code = code
    this.details = details
  }
}
