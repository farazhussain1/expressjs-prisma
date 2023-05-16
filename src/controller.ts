import { Request, Response } from "express";
import { ChatService } from "./service";

export class ChatController {
  constructor(private chatService: ChatService) {}

  async get(req: Request, res: Response) {
    req.userId = 1;
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
}
