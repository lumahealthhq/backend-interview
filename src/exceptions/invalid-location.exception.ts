import {type ValidationError} from 'class-validator';

export class InvalidLocationException extends Error {
  constructor(public readonly details: ValidationError[]) {
    super('Invalid location');
  }
}
