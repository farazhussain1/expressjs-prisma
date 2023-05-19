import { Request, Response, response } from "express";
import { ChatService } from "./service";
import { request } from "http";
import alerts from "./jobs/alerts.json";
import { writeFileSync } from "fs";
import { join } from "path";
export class ChatController {
  constructor(private chatService: ChatService) { }

  async get(req: Request, res: Response) {
    console.log(req.userId);
    const chats = await this.chatService.get(req.userId);
    chats.map((chat: any) => {
      if (chat.recipient.id == req.userId) {
        chat.user = chat.sender;
        delete chat.sender;
        delete chat.recipient;
      } else if (chat.sender.id == req.userId) {
        chat.user = chat.recipient;
        delete chat.recipient;
        delete chat.sender;
      }
      chat.messages = chat.Message;
      delete chat.Message;
    });
    return res.status(200).json({ message: "Retrieved Messages", data: chats });
  }

  async createAlert(req: Request, res: Response) {
    alerts.push({
      cattleId: req.body.cattleId,
      cattleName: req.body.cattleName,
      dateTime: req.body.dateTime,
      message: req.body.message,
      userId: req.userId,
    });
    const filePath = join( __dirname,'/jobs/alerts.json')
    console.log(filePath);

    writeFileSync(filePath, JSON.stringify(alerts));
    console.log(alerts);

    return res.status(200).json({ message: "done" });
  }
}
