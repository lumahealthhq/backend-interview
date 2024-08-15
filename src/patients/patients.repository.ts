import { Injectable } from '@nestjs/common';
import data from '../../sample-data/patients.json';
import { Patient } from './patients.type';

@Injectable()
export class PatientsRepository {
  /**
   *
   * @returns array of patients from json file
   */
  public getWaitlist(): Patient[] {
    return data;
  }
}
