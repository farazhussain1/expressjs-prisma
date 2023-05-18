import { Socket } from "socket.io";

export interface Config {
  NODE_ENV: string;
  SECRET_KEY: string;
  PORT: string;
  DATABASE_URL: string;
}

export interface OnlineUsers {
  [userId: number]: {
    authenticated: boolean;
    socketId: string;
    socket?: Socket;
  };
}

export interface CattleAlert {
  userId: number;
  message: string;
  cattleId: number;
  dateTime: Date;
}
