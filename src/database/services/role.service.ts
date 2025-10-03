// ==========================================
// ROLE SERVICE - Database Operations
// ==========================================
// Contains all database operations related to roles

import prisma from '../client';
import { Role, Prisma } from '@prisma/client';

// ===== TYPES =====

export interface CreateRoleData {
  name: string;
  description?: string;
  permissions: string[];
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  permissions?: string[];
}

// ===== ROLE OPERATIONS =====

/**
 * Create a new role
 */
export async function createRole(data: CreateRoleData): Promise<Role> {
  return await prisma.role.create({
    data,
  });
}

/**
 * Find role by name
 */
export async function findRoleByName(name: string): Promise<Role | null> {
  return await prisma.role.findUnique({
    where: { name },
  });
}

/**
 * Find role by ID
 */
export async function findRoleById(id: string): Promise<Role | null> {
  return await prisma.role.findUnique({
    where: { id },
    include: {
      users: true, // Include users with this role
    },
  });
}

/**
 * Get all roles
 */
export async function getAllRoles(): Promise<Role[]> {
  return await prisma.role.findMany({
    orderBy: { name: 'asc' },
  });
}

/**
 * Update role
 */
export async function updateRole(id: string, data: UpdateRoleData): Promise<Role> {
  return await prisma.role.update({
    where: { id },
    data,
  });
}

/**
 * Delete role
 */
export async function deleteRole(id: string): Promise<Role> {
  return await prisma.role.delete({
    where: { id },
  });
}

/**
 * Check if role can be deleted (no users assigned)
 */
export async function canDeleteRole(id: string): Promise<boolean> {
  const userCount = await prisma.user.count({
    where: { roleId: id },
  });
  return userCount === 0;
}

/**
 * Get users with specific role
 */
export async function getUsersByRole(roleId: string) {
  return await prisma.user.findMany({
    where: { roleId },
    include: {
      role: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}
