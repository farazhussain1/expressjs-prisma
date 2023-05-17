import { Request, Response } from "express";
import express from "express";
import cors from "cors";
import { envConfig } from "./config/envConfig";
import { apiRouter } from "./routes";

const port = envConfig.PORT;

const app = express();
export const server = app.listen(Number(port), '0.0.0.0', () =>
  console.log("server is running at port " + port)
);
// import "./socketServer";

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/api/chats", apiRouter);
app.get("/",(req:Request,res:Response)=>{
  return res.json({
    message:"running"
  })
}

)