import {type ValidationError} from 'class-validator';

export class InvalidPatientException extends Error {
  constructor(public readonly details: ValidationError[]) {
    super('Invalid Patient');
  }
}
