/**
 * Method to round a number up or down to the nearest I (default value for I is 10).
 * E.g.: n = 5 and i = 10; will be rounded to 10.
 * E.g.: n = 30 and i = 20; will be rounded to 40.
 * E.g.: n = 30 and i = 60; will be rounded to 60.
 *
 * @param {number} n number to be rounded.
 *
 * @returns {number} returns the rounded up to the neares I.
 */
exports.roundUp = (n, i = 10) => Math.round(n / i) * i;

/**
 * Method to format a number and fix the decimal digits.
 * E.g.: n = 1.269 and digits = 2; will return 1.27.
 *
 * @param {number} n        The number to be rounded and point-fixed.
 * @param {number} digits   The number of digits to appear after the decimal point.
 *                          If this argument is omitted, it is treated as 2.
 *
 * @returns {number} returns the number with fixed decimals.
 */
exports.fixDecimals = (n, digits = 2) => {
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(n) || isNaN(digits)) {
    return 0;
  }

  // if n is a negative number, convert it to its positive number before round and then
  // convert the result back to its negative number again, before returning the result
  const negativeFactor = n < 0 ? -1 : 1;
  const multiplicator = 10 ** digits; // the same of Math.pow(10, digits)

  return (
    (Math.round(n * negativeFactor * multiplicator) / multiplicator) * negativeFactor);
};
