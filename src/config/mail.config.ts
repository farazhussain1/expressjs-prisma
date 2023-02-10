import { createTransport } from "nodemailer";
import {envConfig} from "./envConfig";

export const transport = createTransport({
  host: envConfig.EMAIL_HOST,
  port: Number(envConfig.EMAIL_PORT),
  auth: {
    user: envConfig.EMAIL_USER,
    pass: envConfig.EMAIL_PASS
  }
});

