import { Cattle, Farm, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export class CattleService {
  constructor() { }

  isUserFarms(farmId: number, userId: number) {
    return prisma.farm.findFirst({
      where: {
        id: farmId,
        userId: userId
      }
    })
  }

  get(farmId: number) {
    return prisma.cattle.findMany({
      where: {
        farmId: farmId
      }
    })
  }

  getById(id: number, farmId: number) {
    return prisma.cattle.findFirst({
      where: {
        id,
        farmId: farmId
      }
    })
  }

  create(cattle: Cattle, user: number) {
    return prisma.cattle.create({
      data: cattle
    })
  }

  delete(cattleId: number, farmId: number) {
    return prisma.cattle.deleteMany({
      where: {
        id: cattleId,
        farmId: farmId
      }
    })
  }

  update(data: any, cattleId: number, farmId: number) {
    return prisma.cattle.updateMany({
      where: {
        id: cattleId,
        farmId: farmId
      },
      data: data
    })
  }

}