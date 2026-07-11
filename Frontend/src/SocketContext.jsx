/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext(null);

let socketInstance = null;

export const SocketProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [connected, setConnected] = useState(false);

  useEffect(() => {

    console.log('TOKEN VALUE:',token);
    if (!token) return;

    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
    }

    socketInstance = io('http://localhost:5000', {
      auth: { token },
      transports: ['polling'],
    });

    socketInstance.on('connect', () => {
      console.log('connected!', socketInstance.id);
      setConnected(true);
    });

    socketInstance.on('disconnect', () => setConnected(false));

    return () => {
      // intentionally not disconnecting on cleanup to survive StrictMode
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket: socketInstance, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used inside <SocketProvider>');
  return ctx;
};