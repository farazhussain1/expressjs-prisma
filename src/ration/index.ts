import { Router } from 'express';
import { RationHandler } from './handler';

export const rationRouter = Router({ strict: true })

const ration = new RationHandler()


rationRouter.get("/", ration.get.bind(ration));

rationRouter.get("/:id", ration.getById.bind(ration));

rationRouter.post("/", ration.create.bind(ration));

// rationRouter.put("/:id", ration.update.bind(ration));

// rationRouter.delete("/:id", ration.delete.bind(ration));
