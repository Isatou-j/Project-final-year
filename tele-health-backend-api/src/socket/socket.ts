import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyToken } from '../utils/jwt';
import { env } from '../config/env';

let io: SocketIOServer | null = null;

export const initializeSocket = (httpServer: HTTPServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: [
        env.FRONTEND_URL,
        'https://isha-final-year-project-frontend.vercel.app',
        'https://project-final-year-git-main-isatou-j-ceesays-projects.vercel.app',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', async (socket) => {
    console.log('🔌 New socket connection:', socket.id);

    try {
      // Authenticate socket connection using JWT token
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        console.warn('⚠️ Socket connection rejected: No token provided');
        socket.disconnect();
        return;
      }

      // Verify token and get user info
      const decoded = verifyToken(token) as { id: number; email: string; role: string };
      
      if (!decoded || !decoded.id) {
        console.warn('⚠️ Socket connection rejected: Invalid token');
        socket.disconnect();
        return;
      }

      const userId = decoded.id;
      const userRole = decoded.role;

      // Join user-specific room
      socket.join(`user:${userId}`);
      console.log(`✅ User ${userId} connected to socket room: user:${userId}`);

      // Join role-specific room (optional, for broadcasting to all users of a role)
      if (userRole) {
        socket.join(`role:${userRole}`);
      }

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`🔌 User ${userId} disconnected from socket`);
      });

      // Handle notification read event
      socket.on('notification:read', async (notificationId: number) => {
        console.log(`📬 User ${userId} marked notification ${notificationId} as read`);
        // The actual marking as read is handled by the API endpoint
        // This is just for real-time updates
      });

    } catch (error: any) {
      console.error('❌ Socket authentication error:', error?.message);
      socket.disconnect();
    }
  });

  console.log('📡 Socket.io server initialized');
  return io;
};

export const emitNotification = (
  userId: number,
  notification: {
    id: number;
    type: string;
    title: string;
    message: string;
    link?: string;
    metadata?: any;
    isRead: boolean;
    createdAt: string;
  },
) => {
  if (!io) {
    console.warn('⚠️ Socket.io not initialized, cannot emit notification');
    return;
  }

  try {
    io.to(`user:${userId}`).emit('notification:new', notification);
    console.log(`📬 Notification emitted to user ${userId}:`, notification.title);
  } catch (error) {
    console.error('❌ Error emitting notification:', error);
  }
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

