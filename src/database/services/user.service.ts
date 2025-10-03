// ==========================================
// USER SERVICE - Database Operations
// ==========================================
// Contains all database operations related to users
// Uses Prisma client for type-safe database queries

import prisma from '../client';
import { User, Prisma } from '@prisma/client';

// ===== TYPES =====

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: string;
  phone?: string;
  avatar?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
}

// ===== USER OPERATIONS =====

/**
 * Create a new user
 */
export async function createUser(data: CreateUserData): Promise<User> {
  return await prisma.user.create({
    data,
    include: {
      role: true, // Include role information
    },
  });
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
    },
  });
}

/**
 * Find user by ID
 */
export async function findUserById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      role: true,
    },
  });
}

/**
 * Update user
 */
export async function updateUser(id: string, data: UpdateUserData): Promise<User> {
  return await prisma.user.update({
    where: { id },
    data,
    include: {
      role: true,
    },
  });
}

/**
 * Get all users with pagination
 */
export async function getUsers(
  page: number = 1,
  limit: number = 10,
  filters?: {
    isActive?: boolean;
    roleId?: string;
    search?: string;
  }
) {
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {};

  // Apply filters
  if (filters?.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  if (filters?.roleId) {
    where.roleId = filters.roleId;
  }

  if (filters?.search) {
    where.OR = [
      { firstName: { contains: filters.search, mode: 'insensitive' } },
      { lastName: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      include: {
        role: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Delete user (soft delete by setting isActive to false)
 */
export async function deleteUser(id: string): Promise<User> {
  return await prisma.user.update({
    where: { id },
    data: { isActive: false },
    include: {
      role: true,
    },
  });
}

/**
 * Hard delete user (permanently remove from database)
 */
export async function hardDeleteUser(id: string): Promise<User> {
  return await prisma.user.delete({
    where: { id },
    include: {
      role: true,
    },
  });
}

/**
 * Count total users
 */
export async function countUsers(): Promise<number> {
  return await prisma.user.count();
}

/**
 * Count active users
 */
export async function countActiveUsers(): Promise<number> {
  return await prisma.user.count({
    where: { isActive: true },
  });
}
