"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (message: any) => void;
  messages: any[];
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  sendMessage: () => {},
  messages: [],
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const socketInstance: Socket = ClientIO(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    // Listen for incoming messages and update state
    socketInstance.on("message", (newMessage: any) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = (message: any) => {
    if (socket) {
      socket.emit("message", message);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
