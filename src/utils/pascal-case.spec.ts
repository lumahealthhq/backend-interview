import pascalCase from './pascal-case';

describe('pascalCase', () => {
  it('should convert dot-separated strings to pascal case', () => {
    expect(pascalCase('hello.world')).toBe('helloWorld');
  });

  it('should convert hyphen-separated strings to pascal case', () => {
    expect(pascalCase('foo-bar')).toBe('fooBar');
  });

  it('should convert underscore-separated strings to pascal case', () => {
    expect(pascalCase('baz_qux')).toBe('bazQux');
  });

  it('should handle mixed separators', () => {
    expect(pascalCase('mixed.separator-example_string')).toBe('mixedSeparatorExampleString');
  });

  it('should return the same string if already in pascal case', () => {
    expect(pascalCase('AlreadyPascalCase')).toBe('AlreadyPascalCase');
  });

  it('should handle single-word input', () => {
    expect(pascalCase('single')).toBe('single');
  });

  it('should handle empty string input', () => {
    expect(pascalCase('')).toBe('');
  });

  it('should handle input with consecutive separators', () => {
    expect(pascalCase('double..separator--test__case')).toBe('doubleSeparatorTestCase');
  });
});
