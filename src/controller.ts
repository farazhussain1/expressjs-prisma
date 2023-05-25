import { Request, Response } from "express";
import { ChatService } from "./service";
import alerts from "./jobs/alerts.json";
import { join } from "path";
import { transport } from "./config/mail.config";
import JOI from "joi";
import { error } from "./helpers/errorHelper";
import { writeFile } from "fs/promises";
import { log } from "console";

export class ChatController {
  constructor(private chatService: ChatService) { }

  async get(req: Request, res: Response) {
    console.log(req.userId);
    const chats = await this.chatService.get(req.userId);
    console.log(chats);

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
      chat.user.lastMessage = chat.Message[chat.Message.length - 1].createdAt
      chat.messages = chat.Message;
      delete chat.Message;
    });
    return res.status(200).json({ message: "Retrieved Messages", data: chats });
  }

  // async createAlert(req: Request, res: Response) {
  //   alerts.push({
  //     cattleId: req.body.cattleId,
  //     cattleName: req.body.cattleName,
  //     dateTime: req.body.dateTime,
  //     message: req.body.message,
  //     userId: req.userId,
  //   });
  //   const event = 
  //   const filePath = join(__dirname, '/jobs/alerts.json')
  //   writeFile(filePath, JSON.stringify(alerts));
  //   return res.status(200).json({ message: "done" });
  // }

  async contactUs(req: Request, res: Response) {
    try {
      const details = req.body;
      console.log(details);
      const validation = JOI.object().keys({
        username: JOI.string().required(),
        email: JOI.string().required().email(),
        message: JOI.string().required(),
      }).validate(req.body, { abortEarly: false });

      if (validation.error) {
        return error("validationError", validation, res);
      }

      const info = await transport.sendMail({
        from: `<${details.email}>`,
        to: 'omersalam6199@gmail.com',
        subject: "Query Generated AgView-CattleLog",
        html: `<h1>${details.username} Genrated a Query</h1><p>${details.message}</p>`,
      });

      if (info.rejected.includes('omersalam6199@gmail.com')) {
        return res
          .status(400)
          .json({ message: "encountered Some Issue in sending email kindly check your connection or try again later" });
      }

      return res.status(200).json({
        message: `Your query sent to support team shortly you will get a reply`,
        details,
      });
    } catch (err: any) {
      return error("catchError", err, res)
    }
  }
}
