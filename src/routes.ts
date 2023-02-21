import { Router } from "express";
import { cattleRouter } from "./cattle";
import { farmRouter } from "./farm";
import { rationRouter } from "./ration";

export const apiRouter = Router()

apiRouter.use('/farm',farmRouter)
apiRouter.use("/cattle",cattleRouter)
apiRouter.use("/ration",rationRouter)