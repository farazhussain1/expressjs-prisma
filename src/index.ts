import express from "express";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/index";
import cors from "cors";

const port = process.env.PORT || 4000;

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', '*'],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRouter)

app.listen(Number(port), () => console.log("server is running at port " + port));