import JOI from "joi";
import { Request, Response } from "express";
import { EventsService } from "./service";
import alerts from "../jobs/alerts.json";
import { writeFile } from "fs/promises";
import { join } from "path";
import { error } from "../helpers/errorHelper";
import { CattleAlert } from "../model";


export class EventsHandler {

  constructor(private eventsService: EventsService = new EventsService()) { }

  async get(req: Request, res: Response) {
    try {
      console.log(req.userId);
      const events = await this.eventsService.get(req.userId)
      return res.status(200).json({ message: "Success", events });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const event = await this.eventsService.getById(+(req.params.id), req.userId);
      if (!event) {
        return res.status(404).json({ message: "events Not Found" });
      }
      return res.status(200).json({ message: "Success", event });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    const validation = JOI.object().keys({
      cattleId: JOI.number().required(),
      cattleName: JOI.string().required(),
      dateTime: JOI.date().iso().required(),
      message: JOI.string().required(),
    }).validate(req.body, { abortEarly: false })
    if (validation.error) {
      return error("validationError", validation, res)
    }
    try {
      req.body.userId = req.userId;

      const event: any = await this.eventsService.create(req.body)
      console.log(event);

      alerts.push({
        id: event.id,
        cattleId: event.cattleId,
        cattleName: event.cattleName,
        dateTime: event.dateTime,
        message: event.message,
        userId: req.userId,
      });
      const filePath = join(__dirname, '../jobs/alerts.json')
      writeFile(filePath, JSON.stringify(alerts));
      return res.status(200).json({ message: "done", event });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const event: any = await this.eventsService.update(Number(req.params.id), req.body)
      if (!event) {
        res.status(400).json({ message: "Couldn't Update!" });
      }
      alerts.map((alert) => {
        if (alert.id == event.id) {
          alert.id = event.id
          alert.cattleId = event.cattleId
          alert.cattleName = event.cattleName
          alert.dateTime = event.dateTime
          alert.message = event.message
          alert.userId = req.userId
        }
      })
      const filePath = join(__dirname, '../jobs/alerts.json')
      writeFile(filePath, JSON.stringify(alerts));
      res.status(200).json({ message: "Event Updated!", event })
      return res;
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const event = await this.eventsService.delete(Number(req.params.id))
      if (!event) {
        return res.status(400).json({ message: "Couldn't delete!" });
      }
      let id;
      alerts.map((alert, i) => {
        if (alert.id == Number(req.params.id)) {
          id = i;
        }
      })
      if (!id) {
        return res.status(400).json({ message: "Couldn't delete! from json object" });
      }
      delete alerts[id];
      const filePath = join(__dirname, '../jobs/alerts.json')
      writeFile(filePath, JSON.stringify(alerts));
      return res.status(200).json({ message: "Event deleted!", event })

    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

}

