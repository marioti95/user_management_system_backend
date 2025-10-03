// ==========================================
// PRISMA CLIENT - Database Connection
// ==========================================
// This file creates and exports a single Prisma client instance
// Used throughout the app for database operations

import { PrismaClient } from '@prisma/client';
import { loadEnvironment, validateEnvironment } from '../config/env';

// Load environment variables before Prisma client initialization
loadEnvironment();

// Validate environment variables
validateEnvironment();

// Create Prisma client with explicit database URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Graceful shutdown handlers
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Export the client
export default prisma;
