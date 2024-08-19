import loggerOptions from './logger-options';
import nodeEnv from '../../../@types/nodeEnv';

describe('loggerOptions', () => {
  it('should have correct options for production environment', () => {
    const productionOptions = loggerOptions['production'];
    expect(productionOptions).toEqual({
      transport: {
        target: 'pino-pretty',
        options: {
          ignore: 'pid,hostname',
          hideObject: true,
          minimumLevel: 'info',
        }
      }
    });
  });

  it('should have correct options for dev environment', () => {
    const devOptions = loggerOptions['dev'];
    expect(devOptions).toEqual({
      transport: {
        target: 'pino-pretty',
        options: {
          ignore: 'pid,hostname',
          hideObject: true,
          minimumLevel: 'trace',
        }
      }
    });
  });

  it('should have correct options for debug environment', () => {
    const debugOptions = loggerOptions['debug'];
    expect(debugOptions).toEqual({
      transport: {
        target: 'pino-pretty',
        options: {
          minimumLevel: 'debug',
          singleLine: true,
        }
      }
    });
  });

  it('should have options for all nodeEnv values', () => {
    const envs: nodeEnv[] = ['production', 'dev', 'debug'];
    envs.forEach(env => {
      expect(loggerOptions[env]).toBeDefined();
    });
  });

  it('should use pino-pretty as target for all environments', () => {
    const envs: nodeEnv[] = ['production', 'dev', 'debug'];
    envs.forEach(env => {
      expect(loggerOptions[env].transport.target).toBe('pino-pretty');
    });
  });
});
