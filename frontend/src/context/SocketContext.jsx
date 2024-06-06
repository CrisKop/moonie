import { createContext, useContext, useEffect } from 'react';
import { useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider (socket context.jsx)');
  }

  return context;
};


export function SocketProvider({ children }) {

  //#region Conexión a socket
    const socket = io.connect("https://chatsocket.criskop.com")

    return (
        <SocketContext.Provider value={{ socket }}>
          {children}
        </SocketContext.Provider>
      );
    }