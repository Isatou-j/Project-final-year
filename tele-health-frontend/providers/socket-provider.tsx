'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { Socket } from 'socket.io-client';
import { initializeSocket, disconnectSocket, getSocket } from '@/lib/socket-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated' && session?.accessToken) {
      try {
        // Initialize socket connection
        const socketInstance = initializeSocket(session.accessToken as string);
        setSocket(socketInstance);

        const handleConnect = () => {
          setIsConnected(true);
        };

        const handleDisconnect = () => {
          setIsConnected(false);
        };

        const handleError = (error: Error) => {
          // Silently handle connection errors - socket will retry automatically
          console.warn('Socket connection issue:', error.message);
        };

        socketInstance.on('connect', handleConnect);
        socketInstance.on('disconnect', handleDisconnect);
        socketInstance.on('connect_error', handleError);

        return () => {
          socketInstance.off('connect', handleConnect);
          socketInstance.off('disconnect', handleDisconnect);
          socketInstance.off('connect_error', handleError);
          disconnectSocket();
          setSocket(null);
          setIsConnected(false);
        };
      } catch (error) {
        console.error('Error initializing socket:', error);
        setIsConnected(false);
      }
    } else {
      // Disconnect if not authenticated
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);
    }
  }, [session, status]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

