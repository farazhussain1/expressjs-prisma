import { Router } from 'express';
import { FarmController } from '../controllers/farmController';
// import { UserService } from '../service';

export const farmRouter = Router()

const farm = new FarmController();


farmRouter.get("/", farm.get.bind(farm));

farmRouter.get("/:farmId", farm.getById.bind(farm));

farmRouter.post("/", farm.create.bind(farm));

farmRouter.put("/:farmId", farm.update.bind(farm));

farmRouter.delete("/:farmId", farm.delete.bind(farm));
