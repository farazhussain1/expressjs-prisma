import { PrismaClient, User, Chat, Message } from "@prisma/client";
const prisma = new PrismaClient();

export class ChatService {
  constructor() { }

  async isExist(data: any) {
    

  }

  async saveMessage(data: any) {
    data.to = +data.to;
    const isExists = await prisma.chat.findFirst({
      where: {
        OR: [
          { from: data.from, to: data.to },
          { from: data.to, to: data.from },
        ],
      },
    });

    if (isExists) {
      return await prisma.message.create({
        data: {
          from: data.from,
          to: +data.to,
          message: data.message,
          chatId: isExists.id,
        },
      });
    }
    return await prisma.chat.create({
      data: {
        from: data.from,
        to: data.to,
        Message: {
          create: {
            from: data.from,
            to: +data.to,
            message: data.message,
          },
        },
      },
    });
  }

  get(id: number) {
    return prisma.chat.findMany({
      where: {
        OR: [{ from: id }, { to: id }],
      },
      select: {
        recipient: {
          select: { id: true, username: true, email: true },
        },
        sender: {
          select: { id: true, username: true, email: true },
        },
        Message: true,
      },
    });
  }
}
