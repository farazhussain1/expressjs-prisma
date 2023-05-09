import { PrismaClient, Farm } from "@prisma/client";
import { milkYieldRouter } from "../milk_yield";
const prisma = new PrismaClient();

export class FarmService {
  constructor() {}

  get(userId: number) {
    return prisma.farm.findMany({
      where: {
        userId: userId,
      },
      include: {
        Cattle: {
          include: {
            MilkYield: {
              where: {
                createdAt: {
                  gte:
                    new Date().toISOString().split("T")[0] + "T00:00:00.000Z",
                },
              },
            },
            _count: true,
          },
        },
        Ration: true,
        _count: true,
      },
    });
  }

  getById(userId: number, farmId: number) {
    return prisma.farm.findFirst({
      where: {
        userId: userId,
        id: farmId,
      },
      include: {
        Cattle: {
          include: {
            MilkYield: {
              where: {
                createdAt: {
                  gte:
                    new Date().toISOString().split("T")[0] + "T00:00:00.000Z",
                },
              },
            },
            _count: true,
          },
        },
        Ration: true,
        _count: true,
      },
    });
  }

  create(farm: Farm) {
    return prisma.farm.create({
      data: farm,
    });
  }

  delete(farmId: number, userId: number) {
    return prisma.farm.deleteMany({
      where: {
        id: farmId,
        userId: userId,
      },
    });
  }

  update(farmId: number, userId: number, data: any) {
    return prisma.farm.updateMany({
      where: {
        id: farmId,
        userId: userId,
      },
      data: data,
    });
  }
}
