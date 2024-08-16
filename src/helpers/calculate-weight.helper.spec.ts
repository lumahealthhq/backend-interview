import {describe, expect, it} from '@jest/globals';
import {calculateWeight} from './calculate-weight.helper';

describe(calculateWeight.name, () => {
  it('should calculate weight correctly for positive correlation and 10% percentage', () => {
    //  Arrange
    const normalizedValue = 0.5;
    const weightParameter = {correlation: 1, percentage: 10};

    //  Act
    const actual = calculateWeight(normalizedValue, weightParameter);

    //  Assert
    expect(actual).toBe(5);
  });

  it('should calculate weight correctly for zero correlation and 20% percentage', () => {
    //  Arrange
    const normalizedValue = -0.5;
    const weightParameter = {correlation: 0, percentage: 20};

    //  Act
    const actual = calculateWeight(normalizedValue, weightParameter);

    //  Assert
    expect(actual).toBe(10);
  });
});
