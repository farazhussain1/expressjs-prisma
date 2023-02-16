import JOI from "joi";
import { Request, Response } from "express";
import { MilkYieldService } from "./service";

export class MilkYieldHandler {

  constructor(private milkYieldService: MilkYieldService = new MilkYieldService()) { }

  async get(req: Request, res: Response) {
    try {
      const farms = await this.milkYieldService.get();
      return res.status(200).json(farms);
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const farms = await this.milkYieldService.getById();
      return res.status(200).json(farms);
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  async create(req: Request, res: Response) {
 
    const validator = JOI.object().keys({
      title: JOI.string().required(),
      description: JOI.string().optional(),
      image: JOI.string().optional(),
      country: JOI.string().required(),
      province: JOI.string().required(),
      district: JOI.string().required(),
      area: JOI.string().required()
    }).validate(req.body, { abortEarly: true })
    if (validator.error) {
      return res.status(400).json({ error: validator.error.details })
    }
    try {
      req.body.user_id = req.userId;
      const farm = await this.milkYieldService.create();
      return res.status(200).json({ message: "New Farm Created!", farm });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  async update(req: Request, res: Response) {
    try {
    const farm = await this.milkYieldService.update()
    //   farm.count
        // ? res.status(200).json({ message: "Farm Updated!" })
        // : res.status(400).json({ message: "Couldn't Update!" });
      return res;
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const farm = await this.milkYieldService.delete()
    //   farm.count
    //     ? res.status(200).json({ message: "Farm Deleted!" })
    //     : res.status(400).json({ message: "Couldn't Deleted!" });
      return res;
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

}

