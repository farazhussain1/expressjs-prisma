import JOI from "joi";
import { Request, Response } from "express";
import { CattleService } from "./service";
import { error } from "../helpers/errorHelper";
import formidable from "formidable";
import multer from "multer";
import storage from "../middleware/multerUpload";
import { uploadFile } from "../helpers/formidable";

const upload = multer({ storage: storage });

export class CattleHandler {
  constructor(private cattleService: CattleService = new CattleService()) {}

  async getCattleStatus(req: Request, res: Response) {
    const cattleStatus: any = {
      heifer: "heifer",
      pregnant: "pregnant",
      dry: "dry",
      milking: "milking",
      sick: "sick",
    };
    return res.status(200).json(cattleStatus);
  }

  async get(req: Request, res: Response) {
    try {
      const farmId = +(req.query.farm_id ?? 0);

      const isFarms = await this.cattleService.isUserFarms(farmId, req.userId);
      if (!isFarms) {
        return res.status(400).json({ message: "invalid Farm" });
      }

      const cattle = await this.cattleService.get(farmId);
      return res.status(200).json(cattle);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const farmId = +(req.query.farm_id ?? 0);
      const cattle = await this.cattleService.getById(+req.params.id, farmId);
      if (!cattle) {
        return res.status(404).json({ message: "Cattle Not Found" });
      }
      return res.status(200).json(cattle);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      req.body = await uploadFile(req, "public/cattleImg");
    } catch (error) {
      console.log({ error: error });
    }
    console.log(req.body);

    const validation = JOI.object()
      .keys({
        farmId: JOI.number().required(),
        idNumber: JOI.number().required(),
        gender: JOI.string().required(),
        breed: JOI.string().required(),
        dob: JOI.date().iso().required(),
        age: JOI.number(),
        cattleStatus: JOI.string().required(),
        vaccinated: JOI.boolean().required(),
        image: JOI.optional(),
      })
      .validate(req.body, { abortEarly: true });
    if (validation.error) {
      return error("validationError", validation, res);
    }

    try {
      const isFarm = await this.cattleService.isUserFarms(
        +req.body.farmId,
        req.userId
      );
      if (!isFarm) {
        return res.status(400).json({ message: "invalid Farm" });
      }

      req.body.farmId = +req.body.farmId;
      req.body.age = +req.body.age;
      req.body.vaccinated = Boolean(req.body.vaccinated);

      const cattle = await this.cattleService.create(req.body, req.userId);
      return res.status(200).json({ message: "Cattle Added!", cattle });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const farmId = +(req.query.farm_id ?? 0);
      const isFarm = await this.cattleService.isUserFarms(farmId, req.userId);
      if (!isFarm) {
        return res.status(400).json({ message: "invalid Farm" });
      }

      const { count } = await this.cattleService.update(
        req.body,
        Number(req.params.id),
        farmId
      );
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
      const farmId = +(req.query.farm_id ?? 0);
      const isFarm = await this.cattleService.isUserFarms(farmId, req.userId);
      if (!isFarm) {
        return res.status(400).json({ message: "invalid Farm" });
      }

      const { count } = await this.cattleService.delete(
        Number(req.params.id),
        farmId
      );
      count
        ? res.status(200).json({ message: "cattle Deleted!" })
        : res.status(400).json({ message: "Couldn't Deleted!" });
      return res;
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
