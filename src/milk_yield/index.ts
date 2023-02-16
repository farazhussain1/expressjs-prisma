import { Router } from 'express';
import { MilkYieldHandler } from './handler';

export const milkYieldRouter = Router()

const milkYield = new MilkYieldHandler()


milkYieldRouter.get("/", milkYield.get.bind(milkYield));

milkYieldRouter.get("/:milkYieldId", milkYield.getById.bind(milkYield));

milkYieldRouter.post("/", milkYield.create.bind(milkYield));

milkYieldRouter.put("/:milkYieldId", milkYield.update.bind(milkYield));

milkYieldRouter.delete("/:milkYieldId", milkYield.delete.bind(milkYield));

milkYieldRouter.all("/milk-yield",)
