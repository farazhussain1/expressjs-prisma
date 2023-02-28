import JOI from "joi";
import { Request, Response } from "express";
import { CattleService } from "./service";
import { error } from "../helpers/errorHelper";

export class CattleHandler {

  constructor(private cattleService: CattleService = new CattleService()) { }

  async get(req: Request, res: Response) {
    try {
      const farmId = +(req.query.farm_id ?? 0)

      const isFarms = await this.cattleService.isUserFarms(farmId, req.userId)
      if (!isFarms) {
        return res.status(400).json({ message: "invalid Farm" })
      }

      const cattle = await this.cattleService.get(farmId);
      return res.status(200).json(cattle);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const farmId = +(req.query.farm_id ?? 0)
      const cattle = await this.cattleService.getById(+(req.params.id), farmId);
      if (!cattle) {
        return res.status(404).json({ message: "Cattle Not Found" });
      }
      return res.status(200).json(cattle);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    const validation = JOI.object().keys({
      farm_id: JOI.number().required(),
      dob: JOI.date().iso().required(),
      gender: JOI.string().required(),
      breed: JOI.string().required(),
      current_status: JOI.string().required(),
      no_of_Deliveries: JOI.number().required(),
    }).validate(req.body, { abortEarly: true })
    if (validation.error) {
      return error("validationError", validation, res)
      // return res.status(400).json({ error: validator.error.details })
    }
    
    try {
      const isFarm = await this.cattleService.isUserFarms(req.body.farm_id, req.userId)
      if (!isFarm) {
        return res.status(400).json({ message: "invalid Farm" })
      }

      req.body.dob = new Date(req.body.dob);
      console.log(req.body.dob)
      const cattle = await this.cattleService.create(req.body, req.userId);
      return res.status(200).json({ message: "Cattle Added!", cattle });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const farmId = +(req.query.farm_id ?? 0)
      const isFarm = await this.cattleService.isUserFarms(farmId, req.userId)
      if (!isFarm) {
        return res.status(400).json({ message: "invalid Farm" })
      }

      const { count } = await this.cattleService.update(req.body, Number(req.params.id), farmId)
      count
        ? res.status(200).json({ message: "Farm Updated!" })
        : res.status(400).json({ message: "Couldn't Update!" });
      return res;
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const farmId = +(req.query.farm_id ?? 0)
      const isFarm = await this.cattleService.isUserFarms(farmId, req.userId)
      if (!isFarm) {
        return res.status(400).json({ message: "invalid Farm" })
      }

      const { count } = await this.cattleService.delete(Number(req.params.id), farmId)
      count
        ? res.status(200).json({ message: "cattle Deleted!" })
        : res.status(400).json({ message: "Couldn't Deleted!" });
      return res;
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

}

