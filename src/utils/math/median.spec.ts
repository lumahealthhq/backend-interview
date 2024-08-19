import median from './median';

describe('median function', () => {
  it('should return the correct median for an odd number of values', () => {
    expect(median([1, 3, 2])).toBe(2);
    expect(median([5, 2, 8, 1, 9])).toBe(5);
  });

  it('should return the correct median for an even number of values', () => {
    expect(median([1, 2, 3, 4])).toBe(3);
    expect(median([1, 3, 5, 7])).toBe(5);
  });

  it('should handle arrays with a single element', () => {
    expect(median([42])).toBe(42);
  });

  it('should handle arrays with negative numbers', () => {
    expect(median([-5, 0, 5])).toBe(0);
    expect(median([-10, -5, -1, 0, 1, 5, 10])).toBe(0);
  });

  it('should handle arrays with duplicate values', () => {
    expect(median([1, 2, 2, 3, 4])).toBe(2);
    expect(median([1, 1, 2, 2])).toBe(2);
  });

  it('should handle arrays with decimal numbers', () => {
    expect(median([1.5, 2.5, 3.5])).toBe(2.5);
    expect(median([1.1, 2.2, 3.3, 4.4])).toBe(3.3);
  });

  it('should modify the original array', () => {
    const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
    median(arr);
    expect(arr).toEqual([1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]);
  });

  it('should throw an error for an empty array', () => {
    expect(() => median([])).toThrow();
  });
});
