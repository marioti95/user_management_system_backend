// ==========================================
// APPLICATION CONFIGURATION
// ==========================================
// Centralized configuration for the entire application

import { loadEnvironment, validateEnvironment } from './env';

// Load environment variables using the centralized utility
loadEnvironment();

// Validate environment variables
validateEnvironment();

export const {
  NODE_ENV,
  DATABASE_URL,
  PORT,
  CLIENT_URL,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  REDIS_URL,
  REDIS_PASSWORD,
  EMAIL_SERVICE,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_FROM,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS
} = process.env;

// Re-export environment utilities
export { 
  loadEnvironment, 
  validateEnvironment, 
  getCurrentEnvironment, 
  isEnvironment,
  isDevelopment,
  isProduction,
  isTest 
} from './env';

// ===== DATABASE CONFIGURATION =====
// export { databaseConfig, getDatabaseUrl, validateDatabaseConfig } from './database';

// // ===== SERVER CONFIGURATION =====
// export const serverConfig = {
//   port: parseInt(process.env.PORT || '5000'),
//   nodeEnv: process.env.NODE_ENV || 'development',
//   clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
// };

// // ===== JWT CONFIGURATION =====
// export const jwtConfig = {
//   accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-in-production',
//   refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
//   accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
//   refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
// };

// // ===== REDIS CONFIGURATION =====
// export const redisConfig = {
//   url: process.env.REDIS_URL || 'redis://redis:6379',
//   password: process.env.REDIS_PASSWORD || '',
// };

// // ===== EMAIL CONFIGURATION =====
// export const emailConfig = {
//   service: process.env.EMAIL_SERVICE || 'gmail',
//   host: process.env.EMAIL_HOST || 'smtp.gmail.com',
//   port: parseInt(process.env.EMAIL_PORT || '587'),
//   user: process.env.EMAIL_USER || '',
//   password: process.env.EMAIL_PASSWORD || '',
//   from: process.env.EMAIL_FROM || 'User Management System <noreply@yourdomain.com>',
// };

// // ===== AWS S3 CONFIGURATION =====
// export const awsConfig = {
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
//   region: process.env.AWS_REGION || 'us-east-1',
//   bucket: process.env.AWS_S3_BUCKET || 'user-management-uploads',
// };

// // ===== RATE LIMITING CONFIGURATION =====
// export const rateLimitConfig = {
//   max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
//   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
// };

// // ===== ENVIRONMENT DETECTION =====
// export const isDevelopment = process.env.NODE_ENV === 'development';
// export const isProduction = process.env.NODE_ENV === 'production';
// export const isTest = process.env.NODE_ENV === 'test';

// // ===== VALIDATION =====
// export function validateConfig(): void {
//   const requiredVars = [
//     'DATABASE_URL',
//     'JWT_ACCESS_SECRET',
//     'JWT_REFRESH_SECRET',
//   ];
  
//   const missing = requiredVars.filter(varName => !process.env[varName]);
  
//   if (missing.length > 0) {
//     console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
//     console.warn('Using default configuration...');
//   }
  
//   if (isProduction && missing.length > 0) {
//     throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
//   }
// }

// // ===== EXPORT ALL CONFIG =====
// export default {
//   database: databaseConfig,
//   server: serverConfig,
//   jwt: jwtConfig,
//   redis: redisConfig,
//   email: emailConfig,
//   aws: awsConfig,
//   rateLimit: rateLimitConfig,
//   isDevelopment,
//   isProduction,
//   isTest,
//   validateConfig,
// };
