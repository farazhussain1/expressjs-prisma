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
  };
}

declare module "express-serve-static-core" {
  interface Request {
    userId: number;
  }
}
