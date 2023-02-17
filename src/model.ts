export interface Config {
  API_GATEWAY: string;
  NODE_ENV: string;
  SECRET_KEY: string;
  PORT: string;
  EMAIL_HOST: string;
  EMAIL_PORT: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  DATABASE_URL: string;
}
export interface ForgetPassword {
  [key: string]: {
    email: string;
    timestamp: number;
  };
}
