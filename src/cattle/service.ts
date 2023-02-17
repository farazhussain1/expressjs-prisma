import { Cattle, Farm, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export class CattleService {
  constructor() { }

  isUserFarms(farm_id: number, user_id: number) {
    return prisma.farm.findFirst({
      where: {
        id: farm_id,
        user_id: user_id
      }
    })
  }

  get(farmId: number) {
    return prisma.cattle.findMany({
      where: {
        farm_id: farmId
      }
    })
  }

  getById(id: number, farmId: number) {
    return prisma.cattle.findFirst({
      where: {
        id,
        farm_id: farmId
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
        farm_id: farmId
      }
    })
  }

  update(data: any, cattleId: number, farmId: number) {
    return prisma.cattle.updateMany({
      where: {
        id: cattleId,
        farm_id: farmId
      },
      data: data
    })
  }

}