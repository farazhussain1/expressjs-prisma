import { Router } from "express";
import { cattleRouter } from "./cattle";
import { farmRouter } from "./farm";
import { rationRouter } from "./ration";
import { milkYieldRouter } from "./milk_yield";

export const apiRouter = Router()

apiRouter.use('/farm',farmRouter)
apiRouter.use("/cattle",cattleRouter)
apiRouter.use("/ration",rationRouter)
apiRouter.use("/milkyield",milkYieldRouter)