import { createServer } from 'http';
import app from './app';
import { env } from './config/env';
import { initializeSocket } from './socket/socket';

const PORT = env.PORT ?? 5000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io
initializeSocket(httpServer);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io initialized for real-time notifications`);
});

export default httpServer;
