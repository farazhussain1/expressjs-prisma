import { createTransport } from "nodemailer";
import config from "./envConfig";

export const transport = createTransport({
  host: config.EMAIL_HOST,
  port: Number(config.EMAIL_PORT),
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS
  }
});

