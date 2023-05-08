import JOI, { number } from "joi";
import { Request, Response } from "express";
import { FarmService } from "./service";
import { error } from "../helpers/errorHelper";

interface farm {
  milkInLiters: number;
}

export class FarmController {
  constructor(private farmService: FarmService = new FarmService()) {}

  async get(req: Request, res: Response) {
    try {
      const farms = await this.farmService.get(req.userId);
      let sum = 0;
      console.log(farms);

      farms.map((farm) => {
        farm.Cattle.map((cattle) => {
          console.log(cattle);

          cattle.MilkYield.map((milkyield) => {
            sum = sum + Number(milkyield.milkInLitres);
          });
        });
        return {
          ...farm,
          _count: {
            ...farm._count,
            milkInliters: sum,
            sum: 0,
          },
        };
        // farm._count.milkInliters = sum;
      });
      console.log("sum", sum);
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
        province: JOI.string().required(),
        area: JOI.string().required(),
        location: JOI.string().required(),
      })
      .validate(req.body, { abortEarly: false });
    if (validation.error) {
      return error("validationError", validation, res);
      // return res.status(400).json({ error: validator.error.details })
    }
    try {
      req.body.userId = req.userId;
      console.log("here");

      const farm = await this.farmService.create(req.body);
      return res.status(200).json({ message: "New Farm Created!", farm });
    } catch (error: any) {
      console.log(error);
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
      console.log(farm);

      farm.count
        ? res.status(200).json({ message: "Farm Deleted!" })
        : res.status(400).json({ message: "Couldn't Deleted!" });
      return res;
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
