import Server from './server';
import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import healthcheck from 'fastify-healthcheck';
import apiRoutes from './routes';
import loggerOptions from './config/logger-options';

jest.mock('fastify');
jest.mock('@fastify/swagger');
jest.mock('@fastify/swagger-ui');
jest.mock('fastify-healthcheck');
jest.mock('../../config/environment', () => ({
  SERVER_PORT: 3000,
  NODE_ENV: 'test'
}));
jest.mock('./routes', () => [
  { method: 'GET', url: '/test', handler: jest.fn() }
]);
jest.mock('./config/logger-options', () => ({
  test: { level: 'error' }
}));

describe('Server', () => {
  let server: Server;
  let mockFastifyInstance: any;

  beforeEach(() => {
    mockFastifyInstance = {
      register: jest.fn(),
      route: jest.fn(),
      listen: jest.fn(),
      log: {
        error: jest.fn()
      }
    };
    ((Fastify as unknown) as jest.Mock).mockReturnValue(mockFastifyInstance);
    server = new Server();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct port', () => {
    expect((server as any).port).toBe(3000);
  });

  it('should initialize Fastify with correct logger options', () => {
    expect(Fastify).toHaveBeenCalledWith({
      logger: (loggerOptions as any).test
    });
  });

  describe('start', () => {
    it('should setup Fastify and create routes', async () => {
      await server.start();

      expect(mockFastifyInstance.register).toHaveBeenCalledWith(swagger);
      expect(mockFastifyInstance.register).toHaveBeenCalledWith(swaggerUI, {
        routePrefix: '/docs',
        logLevel: 'debug'
      });
      expect(mockFastifyInstance.register).toHaveBeenCalledWith(healthcheck);
      expect(mockFastifyInstance.route).toHaveBeenCalledTimes(apiRoutes.length);
      expect(mockFastifyInstance.listen).toHaveBeenCalledWith(
        { port: 3000, host: '0.0.0.0' },
        expect.any(Function)
      );
    });

    it('should exit process if listen throws an error', async () => {
      const mockError = new Error('Listen error');
      mockFastifyInstance.listen.mockImplementation((opts: any, callback: any) => {
        callback(mockError);
      });

      const mockExit = jest.spyOn(process, 'exit').mockImplementation();

      await server.start();

      expect(mockFastifyInstance.log.error).toHaveBeenCalledWith(mockError);
      expect(mockExit).toHaveBeenCalledWith(1);

      mockExit.mockRestore();
    });
  });

  it('should return logger', () => {
    const logger = server.getLogger();
    expect(logger).toBe(mockFastifyInstance.log);
  });
});
