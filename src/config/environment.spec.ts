// Mock the process.env
const mockProcessEnv = (envVars: Partial<NodeJS.ProcessEnv>) => {
  const oldEnv = process.env;
  process.env = { ...oldEnv, ...envVars };
  return () => {
    process.env = oldEnv;
  };
};

describe('Environment Configuration', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('should use default values when no environment variables are set', () => {
    const restore = mockProcessEnv({});
    const env = require('./environment').default;

    expect(env.SERVER_PORT).toBe(3333);
    expect(env.NODE_ENV).toBe('test');  // Updated to expect 'test' as default

    restore();
  });

  it('should parse SERVER_PORT correctly', () => {
    const restore = mockProcessEnv({ SERVER_PORT: '4000' });
    const env = require('./environment').default;

    expect(env.SERVER_PORT).toBe(4000);

    restore();
  });

  it('should parse NODE_ENV correctly for all valid values', () => {
    const validEnvs = ['production', 'dev', 'debug', 'test'];

    validEnvs.forEach(validEnv => {
      const restore = mockProcessEnv({ NODE_ENV: validEnv });
      const env = require('./environment').default;

      expect(env.NODE_ENV).toBe(validEnv);

      restore();
      jest.resetModules();
    });
  });

  it('should throw an error for invalid SERVER_PORT', () => {
    const restore = mockProcessEnv({ SERVER_PORT: '-1' });

    expect(() => {
      require('./environment');
    }).toThrow();

    restore();
  });

  it('should throw an error for invalid NODE_ENV', () => {
    const restore = mockProcessEnv({ NODE_ENV: 'invalid' });

    expect(() => {
      require('./environment');
    }).toThrow();

    restore();
  });
});
