#!/usr/bin/env node

/**
 * Prisma Environment Setup Script
 * 
 * This script loads the appropriate environment variables before running Prisma commands
 * It ensures Prisma CLI tools can access the correct DATABASE_URL
 */

const { config } = require('dotenv');
const { spawn } = require('child_process');

// Get the environment (default to development)
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = `.env.${nodeEnv}`;

console.log(`🔧 Loading environment for ${nodeEnv}...`);

// Load environment variables
const result = config({ path: envFile });

if (result.error) {
  console.warn(`⚠️  Could not load ${envFile}: ${result.error.message}`);
  console.warn('Falling back to default .env file...');
  
  // Fallback to default .env file
  const fallbackResult = config({ path: '.env' });
  if (fallbackResult.error) {
    console.error(`❌ Could not load .env file: ${fallbackResult.error.message}`);
    process.exit(1);
  }
} else {
  console.log(`✅ Loaded environment from ${envFile}`);
}

// Get the command and arguments
const [, , ...args] = process.argv;

if (args.length === 0) {
  console.error('❌ No Prisma command provided');
  process.exit(1);
}

// Run the Prisma command with the loaded environment
const prismaCommand = args[0];
const prismaArgs = args.slice(1);

console.log(`🚀 Running: prisma ${prismaCommand} ${prismaArgs.join(' ')}`);

const child = spawn('npx', ['prisma', ...args], {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

child.on('close', (code) => {
  process.exit(code);
});

child.on('error', (error) => {
  console.error(`❌ Error running Prisma command: ${error.message}`);
  process.exit(1);
});
