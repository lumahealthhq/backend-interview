import nodeEnv from "../../../@types/nodeEnv"

const target = 'pino-pretty'

const loggerOptions: Record<nodeEnv, any> = {
  production: {
    transport: {
      target,
      options: {
        ignore: 'pid,hostname',
        hideObject: true,
        minimumLevel: 'info',
      }
    }
  },

  dev: {
    transport: {
      target,
      options: {
        ignore: 'pid,hostname',
        hideObject: true,
        minimumLevel: 'trace',
      }
    },
  },

  debug: {
    transport: {
      target,
      options: {
        minimumLevel: 'debug',
        singleLine: true,
      }
    },
  },

  test: {
    transport: {
      target,
      options: {
        minimumLevel: 'debug',
        singleLine: true,
      }
    },
  },
}

export default loggerOptions
