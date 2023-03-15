import { PrismaClient, Farm } from "@prisma/client";
const prisma = new PrismaClient()

export class FarmService {
  constructor() { }

  get(userId: number) {
    return prisma.farm.findMany({
      where: {
        userId: userId
      },
      include: { Cattle: true, _count: true }
    })
  }

  getById(userId: number, farmId: number) {
    return prisma.farm.findFirst({
      where: {
        userId: userId,
        id: farmId
      }
    })
  }

  create(farm: Farm) {
    return prisma.farm.create({
      data: farm
    })
  }

  delete(farmId: number, userId: number) {
    return prisma.farm.deleteMany({
      where: {
        id: farmId,
        userId: userId
      }
    })
  }

  update(farmId: number, userId: number, data: any) {
    return prisma.farm.updateMany({
      where: {
        id: farmId,
        userId: userId
      },
      data: data
    })
  }
}