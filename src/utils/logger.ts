// Try to import winston, but provide a fallback if it's not available
let winston: any;
try {
  winston = require('winston');
} catch (error) {
  console.warn('Warning: winston package not found. Using fallback logger. Please install winston for proper logging.');
  // Create a simple fallback logger
  winston = {
    createLogger: () => ({
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error
    }),
    format: {
      combine: () => ({}),
      timestamp: () => ({}),
      json: () => ({}),
      colorize: () => ({}),
      simple: () => ({})
    },
    transports: {
      Console: class {
        constructor() {}
      },
      File: class {
        constructor() {}
      }
    }
  };
}

import { config } from 'dotenv';

config();

const logLevel = process.env.LOG_LEVEL || 'info';

let logger: any;

try {
  logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    defaultMeta: { service: 'sap-middleware' },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      })
    ],
  });

  // Only add file transports if winston is properly available
  if (typeof winston.transports.File === 'function') {
    try {
      logger.add(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
      logger.add(new winston.transports.File({ filename: 'logs/combined.log' }));
    } catch (error) {
      console.warn('Warning: Could not create log files. Logging to console only.');
    }
  }

  // If we're in development, also log to the console with a simpler format
  if (process.env.NODE_ENV === 'development' && typeof winston.transports.Console === 'function') {
    try {
      logger.add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }));
    } catch (error) {
      // Ignore error if this fails
    }
  }
} catch (error) {
  // If winston setup fails, use the fallback logger
  logger = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error
  };
}

export default logger; 