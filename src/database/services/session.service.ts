// ==========================================
// SESSION SERVICE - Database Operations
// ==========================================
// Contains all database operations related to user sessions

import prisma from '../client';

// Temporary type until Prisma client is generated
type Session = any;

// ===== TYPES =====

export interface CreateSessionData {
  token: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
}

export interface UpdateSessionData {
  lastActivityAt?: Date;
  expiresAt?: Date;
}

// ===== SESSION OPERATIONS =====

/**
 * Create a new session
 */
export async function createSession(data: CreateSessionData): Promise<Session> {
  return await prisma.session.create({
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
 * Find session by token
 */
export async function findSessionByToken(token: string): Promise<Session | null> {
  return await prisma.session.findUnique({
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
 * Find session by ID
 */
export async function findSessionById(id: string): Promise<Session | null> {
  return await prisma.session.findUnique({
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
 * Update session
 */
export async function updateSession(id: string, data: UpdateSessionData): Promise<Session> {
  return await prisma.session.update({
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
 * Update session activity
 */
export async function updateSessionActivity(token: string): Promise<Session> {
  return await prisma.session.update({
    where: { token },
    data: {
      lastActivityAt: new Date(),
    },
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
 * Get all sessions for a user
 */
export async function getUserSessions(userId: string): Promise<Session[]> {
  return await prisma.session.findMany({
    where: { userId },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
    orderBy: { lastActivityAt: 'desc' },
  });
}

/**
 * Get active sessions for a user
 */
export async function getActiveUserSessions(userId: string): Promise<Session[]> {
  return await prisma.session.findMany({
    where: {
      userId,
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
    orderBy: { lastActivityAt: 'desc' },
  });
}

/**
 * Delete session
 */
export async function deleteSession(id: string): Promise<Session> {
  return await prisma.session.delete({
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
 * Delete session by token
 */
export async function deleteSessionByToken(token: string): Promise<Session> {
  return await prisma.session.delete({
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
 * Delete all sessions for a user
 */
export async function deleteAllUserSessions(userId: string): Promise<{ count: number }> {
  return await prisma.session.deleteMany({
    where: { userId },
  });
}

/**
 * Delete expired sessions
 */
export async function deleteExpiredSessions(): Promise<{ count: number }> {
  return await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(), // Expired
      },
    },
  });
}

/**
 * Count active sessions for a user
 */
export async function countActiveUserSessions(userId: string): Promise<number> {
  return await prisma.session.count({
    where: {
      userId,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
}

/**
 * Count total sessions
 */
export async function countSessions(): Promise<number> {
  return await prisma.session.count();
}

/**
 * Get sessions with pagination
 */
export async function getSessions(
  page: number = 1,
  limit: number = 10,
  filters?: {
    userId?: string;
    isExpired?: boolean;
  }
) {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters?.userId) {
    where.userId = filters.userId;
  }

  if (filters?.isExpired !== undefined) {
    if (filters.isExpired) {
      where.expiresAt = { lt: new Date() };
    } else {
      where.expiresAt = { gte: new Date() };
    }
  }

  const [sessions, total] = await Promise.all([
    prisma.session.findMany({
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
      orderBy: { lastActivityAt: 'desc' },
    }),
    prisma.session.count({ where }),
  ]);

  return {
    sessions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}