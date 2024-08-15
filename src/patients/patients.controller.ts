import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatientsSearchQuery } from './patients.search-query';
import { PatientSchema } from './patients.swagger';
import { Patient } from './patients.type';
import { PatientsUseCase } from './patients.use-case';

@Controller('patients')
@ApiTags('patients')
export class PatientsController {
  constructor(private _patientsUseCase: PatientsUseCase) {}

  /**
   *
   * @param query receive the query params
   * @returns list of patients base in the page and perPage params
   */
  @Get('/waitlist')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: PatientSchema,
  })
  @ApiOperation({
    summary: 'Get waitlist of patients',
    description: 'Get the wailist of patients ranked by their score.',
  })
  @ApiQuery({ name: 'page', type: 'number', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', type: 'number', required: false, example: 10 })
  @ApiQuery({
    name: 'percentLittleBehavior',
    type: 'number',
    required: false,
    example: 30,
  })
  @ApiQuery({ name: 'lat', type: 'number', required: true, example: -50.53 })
  @ApiQuery({ name: 'long', type: 'number', required: true, example: -108.98 })
  getWaitlist(@Query() query: PatientsSearchQuery): Patient[] {
    return this._patientsUseCase.getWaitlist(query);
  }
}
