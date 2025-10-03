// ==========================================
// ENVIRONMENT LOADING UTILITY
// ==========================================
// Centralized environment variable loading for the entire application

import { config } from 'dotenv';
import path from 'path';

/**
 * Loads environment variables from the appropriate .env file
 * based on NODE_ENV (development, production, test)
 */
export function loadEnvironment(): void {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const envFile = `.env.${nodeEnv}`;
  
  // Load environment variables from the appropriate file
  const result = config({ path: envFile });
  
  if (result.error) {
    console.warn(`⚠️  Could not load ${envFile}: ${result.error.message}`);
    console.warn('Falling back to default .env file...');
    
    // Fallback to default .env file
    const fallbackResult = config({ path: '.env' });
    if (fallbackResult.error) {
      console.error(`❌ Could not load .env file: ${fallbackResult.error.message}`);
      throw new Error('No valid environment file found');
    }
  } else {
    console.log(`✅ Loaded environment from ${envFile}`);
  }
}

/**
 * Validates that required environment variables are present
 */
export function validateEnvironment(): void {
  const requiredVars = [
    'DATABASE_URL',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
}

/**
 * Get the current environment
 */
export function getCurrentEnvironment(): string {
  return process.env.NODE_ENV || 'development';
}

/**
 * Check if we're in a specific environment
 */
export function isEnvironment(env: string): boolean {
  return getCurrentEnvironment() === env;
}

export const isDevelopment = isEnvironment('development');
export const isProduction = isEnvironment('production');
export const isTest = isEnvironment('test');
