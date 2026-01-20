import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1).max(65535))
    .default('5000'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters')
    .optional(),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  DATABASE_URL: z
    .string()
    .url('DATABASE_URL must be a valid PostgreSQL connection string')
    .refine(
      (url) => url.startsWith('postgresql://') || url.startsWith('postgres://'),
      {
        message:
          'DATABASE_URL must be a PostgreSQL connection string (postgresql:// or postgres://)',
      },
    ),
  FRONTEND_URL: z.url().default('http://localhost:3000'),
  ENABLE_CRON_JOBS: z.string().default('false'),
  CLOUDINARY_NAME: z.string().optional(),
  CLOUDINARY_KEY: z.string().optional(),
  CLOUDINARY_SECRET: z.string().optional(),
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.string().transform(Number).pipe(z.number()).optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_FROM: z.email().optional(),
  REDIS_URL: z.url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
  // SendGrid Email Configuration
  SENDGRID_API_KEY: z.string().optional(),
  SENDGRID_FROM_EMAIL: z.string().email().optional(),
  // Google Calendar API Configuration (for Google Meet links)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),
  GOOGLE_REFRESH_TOKEN: z.string().optional(),
  GOOGLE_CALENDAR_ID: z.string().optional(), // Defaults to 'primary' if not set
});

const validateEnv = () => {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      JWT_SECRET: process.env.JWT_SECRET,
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
      JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
      DATABASE_URL: process.env.DATABASE_URL,
      FRONTEND_URL: process.env.FRONTEND_URL,
      ENABLE_CRON_JOBS: process.env.ENABLE_CRON_JOBS,
      CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
      CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
      CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
      EMAIL_HOST: process.env.EMAIL_HOST,
      EMAIL_PORT: process.env.EMAIL_PORT,
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS,
      EMAIL_FROM: process.env.EMAIL_FROM,
      REDIS_URL: process.env.REDIS_URL,
      LOG_LEVEL: process.env.LOG_LEVEL,
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
      GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
      GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(
        (err: z.core.$ZodIssue) => `${err.path.join('.')}: ${err.message}`,
      );
      console.error('Environment validation failed:', missingVars);
      process.exit(1);
    }
    throw error;
  }
};

export const env = validateEnv();

export type Env = typeof env;
