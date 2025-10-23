/**
 * This will prevent the creation of multiple `PrismaClient` instances
 * that would occur due to hot reloading during development.
 * `global` isn't affected by hot reloading, so no new
 * instances will be created during hot reloads.
 */

import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
