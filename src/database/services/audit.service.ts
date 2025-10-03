// ==========================================
// AUDIT SERVICE - Database Operations
// ==========================================
// Contains all database operations related to audit logs

import prisma from '../client';

// Temporary type until Prisma client is generated
type AuditLog = any;

// ===== TYPES =====

export interface CreateAuditLogData {
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface UpdateAuditLogData {
  oldValue?: any;
  newValue?: any;
}

// ===== AUDIT LOG OPERATIONS =====

/**
 * Create a new audit log entry
 */
export async function createAuditLog(data: CreateAuditLogData): Promise<AuditLog> {
  return await prisma.auditLog.create({
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
 * Find audit log by ID
 */
export async function findAuditLogById(id: string): Promise<AuditLog | null> {
  return await prisma.auditLog.findUnique({
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
 * Update audit log
 */
export async function updateAuditLog(id: string, data: UpdateAuditLogData): Promise<AuditLog> {
  return await prisma.auditLog.update({
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
 * Get all audit logs for a user
 */
export async function getUserAuditLogs(userId: string): Promise<AuditLog[]> {
  return await prisma.auditLog.findMany({
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
 * Get audit logs for a specific entity
 */
export async function getEntityAuditLogs(entityType: string, entityId: string): Promise<AuditLog[]> {
  return await prisma.auditLog.findMany({
    where: {
      entityType,
      entityId,
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
 * Get audit logs by action
 */
export async function getAuditLogsByAction(action: string): Promise<AuditLog[]> {
  return await prisma.auditLog.findMany({
    where: { action },
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
 * Get audit logs by entity type
 */
export async function getAuditLogsByEntityType(entityType: string): Promise<AuditLog[]> {
  return await prisma.auditLog.findMany({
    where: { entityType },
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
 * Delete audit log
 */
export async function deleteAuditLog(id: string): Promise<AuditLog> {
  return await prisma.auditLog.delete({
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
 * Delete all audit logs for a user
 */
export async function deleteAllUserAuditLogs(userId: string): Promise<{ count: number }> {
  return await prisma.auditLog.deleteMany({
    where: { userId },
  });
}

/**
 * Delete audit logs older than specified date
 */
export async function deleteOldAuditLogs(olderThan: Date): Promise<{ count: number }> {
  return await prisma.auditLog.deleteMany({
    where: {
      createdAt: {
        lt: olderThan,
      },
    },
  });
}

/**
 * Count audit logs for a user
 */
export async function countUserAuditLogs(userId: string): Promise<number> {
  return await prisma.auditLog.count({
    where: { userId },
  });
}

/**
 * Count audit logs for an entity
 */
export async function countEntityAuditLogs(entityType: string, entityId: string): Promise<number> {
  return await prisma.auditLog.count({
    where: {
      entityType,
      entityId,
    },
  });
}

/**
 * Count total audit logs
 */
export async function countAuditLogs(): Promise<number> {
  return await prisma.auditLog.count();
}

/**
 * Get audit logs with pagination
 */
export async function getAuditLogs(
  page: number = 1,
  limit: number = 10,
  filters?: {
    userId?: string;
    entityType?: string;
    entityId?: string;
    action?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }
) {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters?.userId) {
    where.userId = filters.userId;
  }

  if (filters?.entityType) {
    where.entityType = filters.entityType;
  }

  if (filters?.entityId) {
    where.entityId = filters.entityId;
  }

  if (filters?.action) {
    where.action = filters.action;
  }

  if (filters?.dateFrom || filters?.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) {
      where.createdAt.gte = filters.dateFrom;
    }
    if (filters.dateTo) {
      where.createdAt.lte = filters.dateTo;
    }
  }

  const [auditLogs, total] = await Promise.all([
    prisma.auditLog.findMany({
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
    prisma.auditLog.count({ where }),
  ]);

  return {
    auditLogs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get audit log statistics
 */
export async function getAuditLogStatistics() {
  const [
    totalLogs,
    logsByAction,
    logsByEntityType,
    recentLogs,
  ] = await Promise.all([
    prisma.auditLog.count(),
    prisma.auditLog.groupBy({
      by: ['action'],
      _count: {
        action: true,
      },
      orderBy: {
        _count: {
          action: 'desc',
        },
      },
    }),
    prisma.auditLog.groupBy({
      by: ['entityType'],
      _count: {
        entityType: true,
      },
      orderBy: {
        _count: {
          entityType: 'desc',
        },
      },
    }),
    prisma.auditLog.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    }),
  ]);

  return {
    totalLogs,
    logsByAction,
    logsByEntityType,
    recentLogs,
  };
}

/**
 * Log user action (helper function)
 */
export async function logUserAction(
  action: string,
  entityType: string,
  entityId: string,
  userId: string,
  oldValue?: any,
  newValue?: any,
  ipAddress?: string,
  userAgent?: string
): Promise<AuditLog> {
  return await createAuditLog({
    action,
    entityType,
    entityId,
    userId,
    oldValue,
    newValue,
    ipAddress,
    userAgent,
  });
}