// ==========================================
// DATABASE EXPORTS
// ==========================================
// Central export file for all database-related modules

// Prisma client
export { default as prisma } from './client';

// Services
export * from './services/user.service';
export * from './services/role.service';
export * from './services/session.service';
export * from './services/refresh-token.service';
export * from './services/password-reset.service';
export * from './services/audit.service';

// Types (re-export from Prisma)
// Note: These types will be available after running 'npm run prisma:generate'
// export type { User, Role, Session, RefreshToken, PasswordResetToken, AuditLog } from '@prisma/client';
