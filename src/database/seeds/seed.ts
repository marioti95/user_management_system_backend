// ==========================================
// DATABASE SEED - Initial Data
// ==========================================
// This file populates the database with initial data
// Run with: npm run prisma:seed

import prisma from '../client';
import { createRole } from '../services/role.service';
import { createUser } from '../services/user.service';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seed...');

  // ===== CREATE ROLES =====

  console.log('📝 Creating roles...');

  // Admin role
  const adminRole = await createRole({
    name: 'admin',
    description: 'Full system access',
    permissions: [
      'users:read',
      'users:write',
      'users:delete',
      'roles:read',
      'roles:write',
      'roles:delete',
      'settings:read',
      'settings:write',
      'reports:read',
      'reports:export',
    ],
  });

  // Manager role
  const managerRole = await createRole({
    name: 'manager',
    description: 'Can manage users and view reports',
    permissions: [
      'users:read',
      'users:write',
      'reports:read',
      'reports:export',
    ],
  });

  // User role
  const userRole = await createRole({
    name: 'user',
    description: 'Basic user access',
    permissions: [
      'users:read', // Can view their own profile
    ],
  });

  console.log('✅ Roles created');

  // ===== CREATE USERS =====

  console.log('👥 Creating users...');

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await createUser({
    email: 'admin@example.com',
    password: adminPassword,
    firstName: 'Admin',
    lastName: 'User',
    roleId: adminRole.id,
    phone: '+1234567890',
  });

  // Manager user
  const managerPassword = await bcrypt.hash('manager123', 10);
  await createUser({
    email: 'manager@example.com',
    password: managerPassword,
    firstName: 'Manager',
    lastName: 'User',
    roleId: managerRole.id,
    phone: '+1234567891',
  });

  // Regular user
  const userPassword = await bcrypt.hash('user123', 10);
  await createUser({
    email: 'user@example.com',
    password: userPassword,
    firstName: 'Regular',
    lastName: 'User',
    roleId: userRole.id,
    phone: '+1234567892',
  });

  // Test users
  for (let i = 1; i <= 5; i++) {
    const testPassword = await bcrypt.hash('test123', 10);
    await createUser({
      email: `test${i}@example.com`,
      password: testPassword,
      firstName: `Test${i}`,
      lastName: 'User',
      roleId: userRole.id,
      phone: `+123456789${i + 2}`,
    });
  }

  console.log('✅ Users created');

  // ===== SUMMARY =====

  const userCount = await prisma.user.count();
  const roleCount = await prisma.role.count();

  console.log('🎉 Database seeded successfully!');
  console.log(`📊 Created ${roleCount} roles and ${userCount} users`);

  console.log('\n🔑 Test Credentials:');
  console.log('Admin: admin@example.com / admin123');
  console.log('Manager: manager@example.com / manager123');
  console.log('User: user@example.com / user123');
  console.log('Test users: test1@example.com to test5@example.com / test123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
