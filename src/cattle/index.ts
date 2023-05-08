import { Router } from "express";
import { CattleHandler } from "./handler";

export const cattleRouter = Router({ strict: true });

const cattle = new CattleHandler();

cattleRouter.get("/status", cattle.getCattleStatus.bind(cattle));

cattleRouter.get("/", cattle.get.bind(cattle));

cattleRouter.get("/:id", cattle.getById.bind(cattle));

cattleRouter.post("/", cattle.create.bind(cattle));

cattleRouter.put("/:id", cattle.update.bind(cattle));

cattleRouter.delete("/:id", cattle.delete.bind(cattle));
