import { Request, Response } from "express";
import express from "express";
import cors from "cors";
import { envConfig } from "./config/envConfig";
import { apiRouter } from "./routes";
import cookieParser from "cookie-parser";

const port = envConfig.PORT || 5000;

const app = express();

app.use(express.static("public"));
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "running",
  });
});

app.use("/api/chats", apiRouter);

app.listen(Number(port), "0.0.0.0", () =>
  console.log("server is running at port " + port)
);
// import "./socketServer";
