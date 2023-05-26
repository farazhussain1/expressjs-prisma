import { Request, Response } from "express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { envConfig } from "./config/envConfig";
import { AuthMap } from "./middleware/Auth";
import { apiRouter } from "./routes";
import { eventsRouter } from "./events";

const port = envConfig.PORT;
const app = express();

app.use(express.static("public"));
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => res.json("Chat service is running & up!"));
app.use(AuthMap)
app.use("/api/chats", apiRouter);
app.use("/api/alerts", eventsRouter);

export const httpServer = app.listen(Number(port), () =>
  console.log("server is running at port " + port)
);

import "./socketServer";
import "./jobs/alert"

