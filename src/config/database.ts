// ==========================================
// DATABASE CONFIGURATION
// ==========================================
// Centralized configuration for database connection

import { config } from 'dotenv';

// Load environment variables from .env file
config();

// ===== DATABASE CONFIGURATION =====

export const databaseConfig = {
  // Database URL for Prisma
  url: process.env.DATABASE_URL || 'mysql://user_admin:userpassword123@db:3306/user_management_db',
  
  // Alternative connection details (if needed)
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'user_admin',
  password: process.env.DB_PASSWORD || 'userpassword123',
  database: process.env.DB_NAME || 'user_management_db',
};

// ===== ENVIRONMENT DETECTION =====

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// ===== CONNECTION STRING BUILDER =====

export function getDatabaseUrl(): string {
  // If DATABASE_URL is provided, use it
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Build connection string from individual components
  const { host, port, username, password, database } = databaseConfig;
  return `mysql://${username}:${password}@${host}:${port}/${database}`;
}

// ===== VALIDATION =====

export function validateDatabaseConfig(): void {
  const requiredVars = ['DATABASE_URL'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
    console.warn('Using default database configuration...');
  }
}

// ===== EXPORT FOR PRISMA =====

// Set DATABASE_URL in process.env for Prisma
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = getDatabaseUrl();
}

export default databaseConfig;
