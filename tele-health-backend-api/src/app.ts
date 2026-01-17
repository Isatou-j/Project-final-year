import express, { Request, Response } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { xssProtection } from './middleware/security.middleware';
import { env } from './config/env';
import { requestLogger } from './middleware/request-logger.middleware';
import {
  authRoutes,
  userRoutes,
  physicianRoutes,
  patientRoutes,
  appointmentRoutes,
  reportingRoutes,
  invoiceRoutes,
  receiptRoutes,
  paymentRoutes,
  medicalRecordRoutes,
  prescriptionRoutes,
  serviceRoutes,
  reviewRoutes,
  availabilityRoutes,
} from './routes';


import { errorHandler } from './middleware/error.middleware';
const app = express();

app.set('trust proxy', 1);

app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
  }),
);

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  }),
);

app.use(xssProtection);

// CORS configuration - allow multiple frontend URLs
const allowedOriginStrings = [
  env.FRONTEND_URL,
  'https://isha-final-year-project-frontend.vercel.app',
  'https://project-final-year-git-main-isatou-j-ceesays-projects.vercel.app',
];

// Remove duplicates and trailing slashes
const uniqueOrigins = [...new Set(allowedOriginStrings.map(url => url.replace(/\/$/, '')))];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // In development, allow localhost
      if (env.NODE_ENV === 'development' && origin.includes('localhost')) {
        return callback(null, true);
      }
      
      // Normalize origin (remove trailing slash)
      const normalizedOrigin = origin.replace(/\/$/, '');
      
      // Check if origin matches any allowed origin (exact match)
      const isAllowed = uniqueOrigins.some(allowed => {
        const normalizedAllowed = allowed.replace(/\/$/, '');
        return normalizedOrigin === normalizedAllowed;
      });
      
      // Also allow any Vercel preview deployments
      const isVercelPreview = /^https:\/\/.*\.vercel\.app$/.test(normalizedOrigin);
      
      if (isAllowed || isVercelPreview) {
        callback(null, true);
      } else {
        console.warn('⚠️ CORS blocked origin:', origin);
        console.log('Allowed origins:', uniqueOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

if (env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/v1/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static('uploads'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/physician', physicianRoutes);
app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/appointment', appointmentRoutes);
app.use('/api/v1/reporting', reportingRoutes);
app.use('/api/v1/invoice', invoiceRoutes);
app.use('/api/v1/receipt', receiptRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/medical-record', medicalRecordRoutes);
app.use('/api/v1/prescription', prescriptionRoutes);
app.use('/api/v1/service', serviceRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/availability', availabilityRoutes);

app.get('/health', async (_: Request, res: Response) => {
  try {
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    };

    res.status(200).json(healthCheck);
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Tele-Health API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/v1',
    },
  });
});
app.use(errorHandler);

export default app;
