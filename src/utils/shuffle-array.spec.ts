import shuffleArray from './shuffle-array';

describe('shuffleArray', () => {
  it('should return an array with the same length as the input', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result.length).toBe(input.length);
  });

  it('should contain all the same elements as the input array', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray([...input]);
    expect(result).toEqual(expect.arrayContaining(input));
    expect(input).toEqual(expect.arrayContaining(result));
  });

  it('should return a different order than the input (most of the time)', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = shuffleArray([...input]);
    // This test may occasionally fail due to the nature of randomness
    expect(result).not.toEqual(input);
  });

  it('should work with an array of strings', () => {
    const input = ['a', 'b', 'c', 'd', 'e'];
    const result = shuffleArray(input);
    expect(result.length).toBe(input.length);
    expect(result).toEqual(expect.arrayContaining(input));
  });

  it('should return an empty array when given an empty array', () => {
    const input: number[] = [];
    const result = shuffleArray(input);
    expect(result).toEqual([]);
  });

  it('should return the same array for a single-element array', () => {
    const input = [1];
    const result = shuffleArray(input);
    expect(result).toEqual(input);
  });
});
