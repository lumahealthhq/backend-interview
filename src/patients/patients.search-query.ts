import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

/**
 * page: Optional numeric value, defaults to 1. If provided, it will undergo validation and must be a numeric value greater than or equal to 1.
 * perPage: Optional numeric value, defaults to 10. If provided, it will undergo validation and must be a numeric value greater than or equal to 1.
 */
export class Pagination {
  constructor(page: number = 1, perPage: number = 10) {
    this.perPage = perPage;
    this.page = page;
  }

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Page value should be a number' },
  )
  @Min(1, { message: 'Page value should be equal or greater than 1' })
  page: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'PerPage value should be a number' },
  )
  @Min(1, { message: 'PerPage value should be equal or greater than 1' })
  perPage: number;
}

/**
 * lat: Required numeric value, must be between -90 and 90.
 * long: Required numeric value, must be between -180 and 180.
 * percentLittleBehavior: Optional numeric value, defaults to 20. If provided, it will undergo validation and must be a numeric value between 20 and 100.
 */
export class PatientsSearchQuery extends Pagination {
  constructor(
    page: number,
    perPage: number,
    percentLittleBehavior: number = 20,
  ) {
    super(page, perPage);
    this.percentLittleBehavior = percentLittleBehavior;
  }

  @Type(() => Number)
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Lat value should be a number' },
  )
  @Min(-90, { message: 'Lat value should be equal or greater than -90' })
  @Max(90, { message: 'Lat value should be equal or less than 90' })
  lat: number;

  @Type(() => Number)
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Long value should be a number' },
  )
  @Min(-180, { message: 'Long value should be equal or greater than -180' })
  @Max(180, { message: 'Long value should be equal or less than 180' })
  long: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'PercentLittleBehavior value should be a number' },
  )
  @Min(20, {
    message: 'PercentLittleBehavior value should be equal or greater than 20',
  })
  @Max(100, {
    message: 'PercentLittleBehavior value should be equal or less than 100',
  })
  percentLittleBehavior: number;
}
