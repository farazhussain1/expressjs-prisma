import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class EventsService {
  constructor() { }

  // isUserFarms(farmId: number, userId: number) {
  //   return prisma.farm.findFirst({
  //     where: {
  //       id: farmId,
  //       userId: userId,
  //     },
  //   });
  // }

  get(userId: number) {
    return prisma.events.findMany({
      where: {
        userId: userId,
      },
    });
  }

  getById(id: number, userId: number) {
    return prisma.events.findFirst({
      where: {
        id,
        userId: userId,
      },
    });
  }

  create(event: any) {
    return prisma.events.create({
      data: event
    });
  }

  update(id: number, event: any) {
    return prisma.events.update({
      where: {
        id: id
      },
      data: event
    });
  }

  delete(id: number) {
    return prisma.events.delete({
      where: {
        id: id
      }
    });
  }
}
