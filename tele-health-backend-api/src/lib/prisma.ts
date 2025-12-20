import { PrismaClient } from '../prisma/generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],

    errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

process.on('beforeExit', () => {
  void prisma.$disconnect();
});

process.on('SIGINT', () => {
  void prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', () => {
  void prisma.$disconnect();
  process.exit(0);
});
export default prisma;
