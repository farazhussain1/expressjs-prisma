import { Router } from "express";
import { cattleRouter } from "./cattle";
import { farmRouter } from "./farm";


export const apiRouter = Router()

apiRouter.use('/farm',farmRouter)
apiRouter.use("/cattle",cattleRouter)