// ==========================================
// REFRESH TOKEN SERVICE - Database Operations
// ==========================================
// Contains all database operations related to refresh tokens

import prisma from '../client';

// Temporary type until Prisma client is generated
type RefreshToken = any;

// ===== TYPES =====

export interface CreateRefreshTokenData {
  token: string;
  userId: string;
  expiresAt: Date;
}

export interface UpdateRefreshTokenData {
  isRevoked?: boolean;
  expiresAt?: Date;
}

// ===== REFRESH TOKEN OPERATIONS =====

/**
 * Create a new refresh token
 */
export async function createRefreshToken(data: CreateRefreshTokenData): Promise<RefreshToken> {
  return await prisma.refreshToken.create({
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
 * Find refresh token by token string
 */
export async function findRefreshTokenByToken(token: string): Promise<RefreshToken | null> {
  return await prisma.refreshToken.findUnique({
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
 * Find refresh token by ID
 */
export async function findRefreshTokenById(id: string): Promise<RefreshToken | null> {
  return await prisma.refreshToken.findUnique({
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
 * Update refresh token
 */
export async function updateRefreshToken(id: string, data: UpdateRefreshTokenData): Promise<RefreshToken> {
  return await prisma.refreshToken.update({
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
 * Revoke refresh token
 */
export async function revokeRefreshToken(id: string): Promise<RefreshToken> {
  return await prisma.refreshToken.update({
    where: { id },
    data: { isRevoked: true },
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
 * Revoke refresh token by token string
 */
export async function revokeRefreshTokenByToken(token: string): Promise<RefreshToken> {
  return await prisma.refreshToken.update({
    where: { token },
    data: { isRevoked: true },
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
 * Get all refresh tokens for a user
 */
export async function getUserRefreshTokens(userId: string): Promise<RefreshToken[]> {
  return await prisma.refreshToken.findMany({
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
 * Get active (non-revoked) refresh tokens for a user
 */
export async function getActiveUserRefreshTokens(userId: string): Promise<RefreshToken[]> {
  return await prisma.refreshToken.findMany({
    where: {
      userId,
      isRevoked: false,
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
 * Delete refresh token
 */
export async function deleteRefreshToken(id: string): Promise<RefreshToken> {
  return await prisma.refreshToken.delete({
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
 * Delete refresh token by token string
 */
export async function deleteRefreshTokenByToken(token: string): Promise<RefreshToken> {
  return await prisma.refreshToken.delete({
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
 * Delete all refresh tokens for a user
 */
export async function deleteAllUserRefreshTokens(userId: string): Promise<{ count: number }> {
  return await prisma.refreshToken.deleteMany({
    where: { userId },
  });
}

/**
 * Delete expired refresh tokens
 */
export async function deleteExpiredRefreshTokens(): Promise<{ count: number }> {
  return await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(), // Expired
      },
    },
  });
}

/**
 * Delete revoked refresh tokens
 */
export async function deleteRevokedRefreshTokens(): Promise<{ count: number }> {
  return await prisma.refreshToken.deleteMany({
    where: {
      isRevoked: true,
    },
  });
}

/**
 * Count active refresh tokens for a user
 */
export async function countActiveUserRefreshTokens(userId: string): Promise<number> {
  return await prisma.refreshToken.count({
    where: {
      userId,
      isRevoked: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
}

/**
 * Count total refresh tokens
 */
export async function countRefreshTokens(): Promise<number> {
  return await prisma.refreshToken.count();
}

/**
 * Get refresh tokens with pagination
 */
export async function getRefreshTokens(
  page: number = 1,
  limit: number = 10,
  filters?: {
    userId?: string;
    isRevoked?: boolean;
    isExpired?: boolean;
  }
) {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters?.userId) {
    where.userId = filters.userId;
  }

  if (filters?.isRevoked !== undefined) {
    where.isRevoked = filters.isRevoked;
  }

  if (filters?.isExpired !== undefined) {
    if (filters.isExpired) {
      where.expiresAt = { lt: new Date() };
    } else {
      where.expiresAt = { gte: new Date() };
    }
  }

  const [refreshTokens, total] = await Promise.all([
    prisma.refreshToken.findMany({
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
    prisma.refreshToken.count({ where }),
  ]);

  return {
    refreshTokens,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Check if refresh token is valid (not revoked and not expired)
 */
export async function isRefreshTokenValid(token: string): Promise<boolean> {
  const refreshToken = await prisma.refreshToken.findUnique({
    where: { token },
  });

  if (!refreshToken) {
    return false;
  }

  return !refreshToken.isRevoked && refreshToken.expiresAt > new Date();
}