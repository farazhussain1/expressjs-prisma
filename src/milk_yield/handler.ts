import JOI from "joi";
import { Request, Response } from "express";
import { MilkYieldService } from "./service";

export class MilkYieldHandler {
  constructor(
    private milkYieldService: MilkYieldService = new MilkYieldService()
  ) {}

  async get(req: Request, res: Response) {
    try {
      const { cattle_id } = req.query;

      const farm = await this.milkYieldService.isUserCattle(
        Number(cattle_id),
        req.userId
      );
      if (!farm) {
        return res.status(404).json({ message: "Cattle Not Found" });
      }

      const milkYield = await this.milkYieldService.get(Number(cattle_id));
      return res.status(200).json(milkYield);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { cattle_id } = req.query;

      const farm = await this.milkYieldService.isUserCattle(
        Number(cattle_id),
        req.userId
      );
      console.log(farm);

      if (!farm) {
        return res.status(400).json({ message: "Cattle not found" });
      }
      console.log(req.params.id);
      const milkYield = await this.milkYieldService.getById(
        Number(req.params.id)
      );
      return res.status(200).json(milkYield);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    const validator = JOI.object()
      .keys({
        cattleId: JOI.number().required(),
        milkInLitres: JOI.number().required(),
        milkYieldDate: JOI.date().required(),
      })
      .validate(req.body, { abortEarly: true });
    if (validator.error) {
      return res.status(400).json({ error: validator.error.details });
    }
    try {
      const farm = await this.milkYieldService.isUserCattle(
        req.body.cattleId,
        req.userId
      );
      console.log(farm);

      if (!farm) {
        return res.status(400).json({ message: "Cattle not found" });
      }
      const ration = await this.milkYieldService.create(req.body);
      return res.status(200).json({ message: "Retained Ration !!", ration });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
