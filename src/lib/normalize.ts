/**
 * @param value Must be greater than min and less than max
 * @returns {number} A number between 0 and 1, representing how close "value" is to either "max" or "min".
 */
export const normalize = (value: number, min: number, max: number) => {
  // ? Avoid division by 0. Returning 0.5 because it's common ground.
  if (max === min) return 0.5;

  return Math.abs(value - min) / Math.abs(max - min);
};
