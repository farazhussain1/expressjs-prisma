import { Request, Response, response } from "express";
import { ChatService } from "./service";
import { request } from "http";
import alerts from "./jobs/alerts.json";
import { writeFileSync } from "fs";
import { join } from "path";
import { envConfig } from "./config/envConfig";
import { transport } from "./config/mail.config";
import JOI from "joi";
import { error } from "./helpers/errorHelper";

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
      chat.user.lastMessage = chat.Message[chat.Message.length - 1].createdAt
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
    const filePath = join(__dirname, '/jobs/alerts.json')
    writeFileSync(filePath, JSON.stringify(alerts));
    return res.status(200).json({ message: "done" });
  }

  async contactUs(req: Request, res: Response) {
    try {
      const details = req.body;
      console.log(details);
      const validation = JOI.object()
        .keys({
          username: JOI.string().required(),
          email: JOI.string().required().email(),
          message: JOI.string().required(),
        })
        .validate(req.body, { abortEarly: false });

      // validation.error?.details.forEach((element) => {
      //   console.log(element.message);
      // });

      if (validation.error) {
        return error("validationError", validation, res);
      }


      // const existingUser = await this.chatService.isExists(email);
      // if (existingUser) {
      //   return res.status(400).json({ message: "User already exists" });
      // }
      // const existingNumber = await userService.isExists(number);
      // if (existingNumber) {
      //   return res.status(400).json({ message: "Number Already In use" });
      // }


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
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
