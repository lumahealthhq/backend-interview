import { Injectable } from '@nestjs/common';

@Injectable()
export class NormalizationService {
  private MAX_SCALE_VALUE = 10;
  private MIN_SCALE_VALUE = 1;
  private EXPAND_FACTOR = this.MAX_SCALE_VALUE - this.MIN_SCALE_VALUE;

  /**
   *
   * @param value the value to be normalized
   * @param min the min value of the range
   * @param max the max value of the range
   * @returns A number normalized between 0 and 10
   */
  private normalization(value: number, min: number, max: number) {
    const normalizedValue = min === max ? 0.5 : (value - min) / (max - min);
    return normalizedValue * this.EXPAND_FACTOR;
  }

  /**
   *
   * @param value the value to be normalized
   * @param min the min value of the range
   * @param max the max value of the range
   * @returns A number normalized in positive scale
   */
  public positiveNormalization(value: number, min: number, max: number) {
    return this.MIN_SCALE_VALUE + this.normalization(value, min, max);
  }

  /**
   *
   * @param value the value to be normalized
   * @param min the min value of the range
   * @param max the max value of the range
   * @returns A number normalized in negative scale
   */
  public negativeNormalization(value: number, min: number, max: number) {
    return this.MAX_SCALE_VALUE - this.normalization(value, min, max);
  }
}
