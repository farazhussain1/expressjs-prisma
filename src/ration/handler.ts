import JOI from "joi";
import { Request, Response } from "express";
import { RationService } from "./service";
import { error } from "../helpers/errorHelper";

export class RationHandler {

  constructor(private rationService: RationService = new RationService()) { }

  async get(req: Request, res: Response) {
    try {
      const farmId = +(req.query.farm_id ?? 0)
      const isFarms = await this.rationService.isUserFarms(farmId, req.userId)
      if (!isFarms) {
        return res.status(400).json({ message: "invalid Farm" })
      }
      const ration = await this.rationService.get(farmId);
      return res.status(200).json(ration);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const farmId = +(req.query.farm_id ?? 0)
      const ration = await this.rationService.getById(+(req.params.id), farmId);
      if (!ration) {
        return res.status(404).json({ message: "Ration Not Found" });
      }
      return res.status(200).json(ration);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    const validation = JOI.object().keys({
      farmId: JOI.number().required(),
      rationCategory: JOI.string().required(),
      quantity: JOI.number().required(),
      purchaseDate: JOI.date().iso().required()
    }).validate(req.body, { abortEarly: false })
    if (validation.error) {
      return error("validationError", validation, res)
    }

    try {
      const isFarm = await this.rationService.isUserFarms(req.body.farm_id, req.userId)
      console.log(isFarm);
      
      if (!isFarm) {
        return res.status(400).json({ message: "invalid Farm" })
      }

      const ration = await this.rationService.create(req.body);
      return res.status(200).json({ message: "Retained Ration !!", ration });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // async update(req: Request, res: Response) {
  //   try {
  //     const farmId = +(req.query.farm_id ?? 0)
  //     const isFarm = await this.rationService.isUserFarms(farmId, req.userId)
  //     if (!isFarm) {
  //       return res.status(400).json({ message: "invalid Farm" })
  //     }

  //     const { count } = await this.rationService.update(req.body, Number(req.params.id), farmId)
  //     count
  //       ? res.status(200).json({ message: "Farm Updated!" })
  //       : res.status(400).json({ message: "Couldn't Update!" });
  //     return res;
  //   } catch (error: any) {
  //     return res.status(500).json({ message: error.message });
  //   }
  // }

  // async delete(req: Request, res: Response) {
  //   try {
  //     const farmId = +(req.query.farm_id ?? 0)
  //     const isFarm = await this.rationService.isUserFarms(farmId, req.userId)
  //     if (!isFarm) {
  //       return res.status(400).json({ message: "invalid Farm" })
  //     }

  //     const { count } = await this.rationService.delete(Number(req.params.id), farmId)
  //     count
  //       ? res.status(200).json({ message: "cattle Deleted!" })
  //       : res.status(400).json({ message: "Couldn't Deleted!" });
  //     return res;
  //   } catch (error: any) {
  //     return res.status(500).json({ message: error.message });
  //   }
  // }

}

