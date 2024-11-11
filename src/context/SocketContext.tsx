import React, { createContext, useContext, useState } from 'react';
import { Socket, io } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | undefined;
  connectSocket: (token: string) => void;
  disconnectSocket: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: undefined,
  connectSocket: () => {},
  disconnectSocket: () => {},
});

export const UseSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  const connectSocket = (token: string) => {
    const newSocket = io(process.env.REACT_APP_API_URL, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    setSocket(newSocket);

    newSocket?.on('receiveMessage', (message: any) => {
      console.log('New message received:', message);
    });
  };

  const disconnectSocket = () => {
    if (socket) {
      socket?.disconnect();
      setSocket(undefined);
    }
  };

  const value = {
    socket,
    connectSocket,
    disconnectSocket,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};