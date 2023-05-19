import { Farm, PrismaClient } from "@prisma/client";
import { milkYieldRouter } from "../milk_yield";
const prisma = new PrismaClient();

export class FarmService {
  constructor() {}

  isExist(farmName: string) {
    return prisma.farm.findFirst({
      where: {
        farmName: farmName,
      },
    });
  }

  get(userId: number) {
    return prisma.farm.findMany({
      where: {
        userId: userId,
      },
      include: {
        Coordinates: { select: { longitude: true, latitude: true } },
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
        Coordinates: { select: { longitude: true, latitude: true } },
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

  create(farm: any) {
    const coordinates = farm.coordinates;
    delete farm.coordinates;
    console.log(farm);

    return prisma.farm.create({
      data: {
        Coordinates: { createMany: { data: coordinates } },
        area: farm.area,
        country: farm.country,
        farmName: farm.farmName,
        userId: farm.userId,
        province: farm.province,
      },
      select: {
        id: true,
        userId: true,
        farmName: true,
        area: true,
        province: true,
        Coordinates: { select: { longitude: true, latitude: true } },
        createdAt: true,
        updatedAt: true,
      },
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
