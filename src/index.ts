import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import logger from './utils/logger';
import integrationContentRoutes from './routes/integration-content.routes';
import messageProcessingLogsRoutes from './routes/message-processing-logs.routes';
import logFilesRoutes from './routes/log-files.routes';
import securityContentRoutes from './routes/security-content.routes';
import messageStoreRoutes from './routes/message-store.routes';

// Load environment variables
dotenv.config();

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Apply middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use(limiter);

// Define routes
app.use('/api/integration-content', integrationContentRoutes);
app.use('/api/message-processing-logs', messageProcessingLogsRoutes);
app.use('/api/log-files', logFilesRoutes);
app.use('/api/security-content', securityContentRoutes);
app.use('/api/message-store', messageStoreRoutes);

// Basic root route
app.get('/', (req, res) => {
  res.json({
    message: 'SAP Middleware API',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});

export default app; 