import { Response } from 'express';

// Extend the Response interface to allow returning Response from handlers
declare module 'express-serve-static-core' {
  interface Response {
    // Allow returning Response from handlers
    send: <T>(body?: T) => this;
  }
} 