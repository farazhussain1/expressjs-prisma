export interface Config {
  NODE_ENV: string;
  SECRET_KEY: string;
  PORT: string;
  EMAIL_HOST: string;
  EMAIL_PORT: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  DB_CONNECTION_STRING: string;
}
export interface ForgetPassword {
  [key: string]: {
    email: string,
    timestamp: number,
  };
}

export interface Data{
  id?:string;
  email?:string
}
