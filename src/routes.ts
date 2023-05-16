import express, { Router } from "express";
import { ChatController } from "./controller";
import { ChatService } from "./service";

export const apiRouter = Router();
const chatController = new ChatController(new ChatService());

apiRouter.get("/n", chatController.get.bind(chatController));
