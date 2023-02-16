import express from "express";
import cookieParser from "cookie-parser";
import { envConfig } from "./config/envConfig";
import cors from "cors";
import { farmRouter } from "./farm";
import { AuthMap } from "./middleware/Auth";
import { cattleRouter } from "./cattle";
import { milkYieldRouter } from "./milk_yield";
import { apiRouter } from "./routes";

const port = envConfig.PORT || 4000;

const app = express();

app.use(cors({
    origin: "*",
    //  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());

app.use(AuthMap)
app.use('/',apiRouter)

app.get("/", (req, res) => res.status(200).json({ message: "Server is running and up!" }));

app.listen(port, () => console.log("server is running at port " + port));
