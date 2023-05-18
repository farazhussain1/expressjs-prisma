import JOI, { number } from "joi";
import { Request, Response } from "express";
import { FarmService } from "./service";
import { error } from "../helpers/errorHelper";
import { Farm, RationCategory } from "@prisma/client";

export class FarmController {
  constructor(private farmService: FarmService = new FarmService()) {}

  async get(req: Request, res: Response) {
    try {
      const farms = await this.farmService.get(req.userId);
      farms.map((farm: any) => {
        farm.totalMilkYield = 0;
        farm.Cattle.map((cattle: any) => {
          cattle.totalMilkYield = 0;
          cattle.MilkYield.map((milkYield: any) => cattle.totalMilkYield += Number(milkYield.milkInLitres));
          farm.totalMilkYield += cattle.totalMilkYield;
        });
      });
      return res.status(200).json(farms);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const farm = await this.farmService.getById(
        req.userId,
        Number(req.params.farmId)
      );
      if (!farm) {
        return res.status(404).json({ message: "Farm Not Found" });
      }
      return res.status(200).json(farm);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    const validation = JOI.object()
      .keys({
        farmName: JOI.string().required(),
        country: JOI.string().required(),
        province: JOI.string().optional(),
        area: JOI.string().required(),
        coordinates: JOI.array().required(),
      })
      .validate(req.body, { abortEarly: false });
    if (validation.error) {
      return error("validationError", validation, res);
    }
    try {
      const isExist = await this.farmService.isExist(req.body.farmName);
      if (isExist) {
        return res.status(403).json({ message: "Farm Name Already Exist" });
      }
      req.body.userId = req.userId; 
      const farm = await this.farmService.create(req.body);
      return res.status(200).json({ message: "New Farm Created!", farm });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const farm = await this.farmService.update(
        Number(req.params.farmId),
        req.userId,
        req.body
      );
      farm.count
        ? res.status(200).json({ message: "Farm Updated!" })
        : res.status(400).json({ message: "Couldn't Update!" });
      return res;
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const farm = await this.farmService.delete(
        Number(req.params.farmId),
        req.userId
      );

      farm.count
        ? res.status(200).json({ message: "Farm Deleted!" })
        : res.status(400).json({ message: "Couldn't Deleted!" });
      return res;
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
