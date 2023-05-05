import { Router } from "express";
import { MilkYieldHandler } from "./handler";

export const milkYieldRouter = Router();

const milkYield = new MilkYieldHandler();

milkYieldRouter.get("/", milkYield.get.bind(milkYield));

milkYieldRouter.get("/:id", milkYield.getById.bind(milkYield));

milkYieldRouter.post("/", milkYield.create.bind(milkYield));