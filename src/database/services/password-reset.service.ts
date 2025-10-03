// ==========================================
// PASSWORD RESET SERVICE - Database Operations
// ==========================================
// Contains all database operations related to password reset tokens

import prisma from '../client';

// Temporary type until Prisma client is generated
type PasswordResetToken = any;

// ===== TYPES =====

export interface CreatePasswordResetTokenData {
  token: string;
  userId: string;
  expiresAt: Date;
}

export interface UpdatePasswordResetTokenData {
  isUsed?: boolean;
  expiresAt?: Date;
}

// ===== PASSWORD RESET TOKEN OPERATIONS =====

/**
 * Create a new password reset token
 */
export async function createPasswordResetToken(data: CreatePasswordResetTokenData): Promise<PasswordResetToken> {
  return await prisma.passwordResetToken.create({
    data,
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });
}

/**
 * Find password reset token by token string
 */
export async function findPasswordResetTokenByToken(token: string): Promise<PasswordResetToken | null> {
  return await prisma.passwordResetToken.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });
}

/**
 * Find password reset token by ID
 */
export async function findPasswordResetTokenById(id: string): Promise<PasswordResetToken | null> {
  return await prisma.passwordResetToken.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });
}

/**
 * Update password reset token
 */
export async function updatePasswordResetToken(id: string, data: UpdatePasswordResetTokenData): Promise<PasswordResetToken> {
  return await prisma.passwordResetToken.update({
    where: { id },
    data,
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });
}

/**
 * Mark password reset token as used
 */
export async function markPasswordResetTokenAsUsed(id: string): Promise<PasswordResetToken> {
  return await prisma.passwordResetToken.update({
    where: { id },
    data: { isUsed: true },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });
}

/**
 * Mark password reset token as used by token string
 */
export async function markPasswordResetTokenAsUsedByToken(token: string): Promise<PasswordResetToken> {
  return await prisma.passwordResetToken.update({
    where: { token },
    data: { isUsed: true },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });
}

/**
 * Get all password reset tokens for a user
 */
export async function getUserPasswordResetTokens(userId: string): Promise<PasswordResetToken[]> {
  return await prisma.passwordResetToken.findMany({
    where: { userId },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get active (unused and not expired) password reset tokens for a user
 */
export async function getActiveUserPasswordResetTokens(userId: string): Promise<PasswordResetToken[]> {
  return await prisma.passwordResetToken.findMany({
    where: {
      userId,
      isUsed: false,
      expiresAt: {
        gt: new Date(), // Not expired
      },
    },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Delete password reset token
 */
export async function deletePasswordResetToken(id: string): Promise<PasswordResetToken> {
  return await prisma.passwordResetToken.delete({
    where: { id },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });
}

/**
 * Delete password reset token by token string
 */
export async function deletePasswordResetTokenByToken(token: string): Promise<PasswordResetToken> {
  return await prisma.passwordResetToken.delete({
    where: { token },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });
}

/**
 * Delete all password reset tokens for a user
 */
export async function deleteAllUserPasswordResetTokens(userId: string): Promise<{ count: number }> {
  return await prisma.passwordResetToken.deleteMany({
    where: { userId },
  });
}

/**
 * Delete expired password reset tokens
 */
export async function deleteExpiredPasswordResetTokens(): Promise<{ count: number }> {
  return await prisma.passwordResetToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(), // Expired
      },
    },
  });
}

/**
 * Delete used password reset tokens
 */
export async function deleteUsedPasswordResetTokens(): Promise<{ count: number }> {
  return await prisma.passwordResetToken.deleteMany({
    where: {
      isUsed: true,
    },
  });
}

/**
 * Count active password reset tokens for a user
 */
export async function countActiveUserPasswordResetTokens(userId: string): Promise<number> {
  return await prisma.passwordResetToken.count({
    where: {
      userId,
      isUsed: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
}

/**
 * Count total password reset tokens
 */
export async function countPasswordResetTokens(): Promise<number> {
  return await prisma.passwordResetToken.count();
}

/**
 * Get password reset tokens with pagination
 */
export async function getPasswordResetTokens(
  page: number = 1,
  limit: number = 10,
  filters?: {
    userId?: string;
    isUsed?: boolean;
    isExpired?: boolean;
  }
) {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters?.userId) {
    where.userId = filters.userId;
  }

  if (filters?.isUsed !== undefined) {
    where.isUsed = filters.isUsed;
  }

  if (filters?.isExpired !== undefined) {
    if (filters.isExpired) {
      where.expiresAt = { lt: new Date() };
    } else {
      where.expiresAt = { gte: new Date() };
    }
  }

  const [passwordResetTokens, total] = await Promise.all([
    prisma.passwordResetToken.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.passwordResetToken.count({ where }),
  ]);

  return {
    passwordResetTokens,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Check if password reset token is valid (not used and not expired)
 */
export async function isPasswordResetTokenValid(token: string): Promise<boolean> {
  const passwordResetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!passwordResetToken) {
    return false;
  }

  return !passwordResetToken.isUsed && passwordResetToken.expiresAt > new Date();
}

/**
 * Invalidate all password reset tokens for a user (when password is successfully reset)
 */
export async function invalidateAllUserPasswordResetTokens(userId: string): Promise<{ count: number }> {
  return await prisma.passwordResetToken.updateMany({
    where: { userId },
    data: { isUsed: true },
  });
}