import { MilkYield, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class MilkYieldService {
  constructor() {}

  isUserCattle(cattleId: number, userId: number) {
    return prisma.farm.findFirst({
      where: {
        userId: userId,
        Cattle: {
          some: {
            id: cattleId,
          },
        },
      },
      include: { Cattle: { where: { id: cattleId } }, _count: true },
    });
  }

  get(cattleId: number) {
    return prisma.milkYield.findMany({
      where: { cattleId },
    });
  }

  getById(id: number) {
    return prisma.milkYield.findFirst({
      where: {
        id: id,
      },
    });
  }

  create(milk_yield: MilkYield) {
    return prisma.milkYield.create({
      data: milk_yield,
    });
  }

  delete() {}

  update() {}
}
