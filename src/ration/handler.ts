import JOI from "joi";
import { Request, Response } from "express";
import { RationService } from "./service";
import { error } from "../helpers/errorHelper";

export class RationHandler {

  constructor(private rationService: RationService = new RationService()) { }

  async get(req: Request, res: Response) {
    try {
      const farmId = +(req.query.farmId ?? 0)

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
      const farmId = +(req.query.farmId ?? 0)
      const cattle = await this.rationService.getById(+(req.params.id), farmId);
      return res.status(200).json(cattle);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    const validation = JOI.object().keys({
      farm_id: JOI.number().required(),
      ration_name: JOI.string().required(),
      kilograms: JOI.number().required(),
      purchase_date: JOI.date().iso().required(),
      approx_daily_usage: JOI.number().required(),
      month: JOI.string().required(),
    }).validate(req.body, { abortEarly: false })
    if (validation.error) {
      return error("validationError", validation, res)
      // return res.status(400).json({ error: validator.error.details })
    }

    try {
      const isFarm = await this.rationService.isUserFarms(req.body.farm_id, req.userId)
      if (!isFarm) {
        return res.status(400).json({ message: "invalid Farm" })
      }

      req.body.purchase_date = new Date(req.body.purchase_date);
      console.log(req.body.purchase_date);
      const ration = await this.rationService.create(req.body);
      return res.status(200).json({ message: "Retained Ration !!", ration });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // async update(req: Request, res: Response) {
  //   try {
  //     const farmId = +(req.query.farmId ?? 0)
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
  //     const farmId = +(req.query.farmId ?? 0)
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

