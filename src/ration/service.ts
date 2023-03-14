import { PrismaClient, Ration } from "@prisma/client";
const prisma = new PrismaClient()

export class RationService {
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
    return prisma.ration.findMany({
      where: {
        farmId: farmId
      }
    })
  }

  getById(id: number, farmId: number) {
    return prisma.ration.findFirst({
      where: {
        id,
        farmId: farmId
      }
    })
  }

  create(ration: Ration) {
    return prisma.ration.create({
      data: ration
    })
  }
  
}