import {describe, expect, it} from '@jest/globals';
import {Normalization} from './normalization.helper';

describe(Normalization.name, () => {
  describe(Normalization.minMaxNormalize.name, () => {
    it('should normalize value to 1 if max value is equal to value to normalize', () => {
      //  Arrange
      const valueMinMax = {min: 0, max: 10};
      const valueToNormalize = valueMinMax.max;

      //  Act
      const actual = Normalization.minMaxNormalize(valueToNormalize, valueMinMax);

      //  Assert
      expect(actual).toBe(1);
    });

    it('should normalize value to 0 if min value is equal to value to normalize', () => {
      //  Arrange
      const valueMinMax = {min: 0, max: 10};
      const valueToNormalize = valueMinMax.min;

      //  Act
      const actual = Normalization.minMaxNormalize(valueToNormalize, valueMinMax);

      //  Assert
      expect(actual).toBe(0);
    });

    it('should normalize value to 0.5 when value is in the middle of min and max', () => {
      //  Arrange
      const valueMinMax = {min: 0, max: 10};
      const valueToNormalize = 5;

      //  Act
      const actual = Normalization.minMaxNormalize(valueToNormalize, valueMinMax);

      //  Assert
      expect(actual).toBe(0.5);
    });

    it('should normalize value to 0 if max value is equal to min value', () => {
      //  Arrange
      const valueMinMax = {min: 10, max: 10};
      const valueToNormalize = 10;

      //  Act
      const actual = Normalization.minMaxNormalize(valueToNormalize, valueMinMax);

      //  Assert
      expect(actual).toBe(0);
    });
  });
});
