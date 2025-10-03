// ==========================================
// ENVIRONMENT SETUP SCRIPT
// ==========================================
// This script sets the DATABASE_URL environment variable for Prisma

// Set DATABASE_URL for Prisma
process.env.DATABASE_URL = 'mysql://user_admin:userpassword123@db:3306/user_management_db';

// Set other required environment variables
process.env.JWT_ACCESS_SECRET = 'dev-access-secret-change-in-production';
process.env.JWT_REFRESH_SECRET = 'dev-refresh-secret-change-in-production';
process.env.NODE_ENV = 'development';
process.env.PORT = '5000';

console.log('✅ Environment variables set:');
console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${process.env.PORT}`);
