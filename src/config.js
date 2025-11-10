import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config();

const configObj = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  errorHandlerDir: join(process.cwd(), 'errorHandler'),
};

export default configObj;
