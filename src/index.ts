import { Request, Response } from "express";
import express from "express";
import cors from "cors";
import { envConfig } from "./config/envConfig";
import { apiRouter } from "./routes";
import cookieParser from "cookie-parser";
import { AuthMap } from "./middleware/Auth";

const app = express();
const port = envConfig.PORT;

app.use(express.static("public"));
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) =>
  res.json("Chat service is running & up!")
);
app.use(AuthMap)
app.use("/api/chats", apiRouter);
app.use("/api/alert", apiRouter);

export const httpServer = app.listen(Number(port), '0.0.0.0', () =>
  console.log("server is running at port " + port)
);
import "./socketServer";
import "./jobs/alert"

