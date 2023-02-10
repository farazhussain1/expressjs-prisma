import { PrismaClient, Farm } from "@prisma/client";
const prisma = new PrismaClient({ log: ["query"] })

export class FarmService {
  constructor() { }

  get(userId: number) {
    console.log(userId);

    return prisma.farm.findMany({
      where: {
        user_id: userId
      }
    })
  }

  getById(userId: number, farmId: number) {
    console.log(userId)
    return prisma.farm.findFirst({
      where: {
        user_id: userId,
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
        user_id: userId
      }
    })
  }

  update(farmId: number, userId: number, data: any) {
    return prisma.farm.updateMany({
      where: {
        id: farmId,
        user_id: userId
      },
      data: data
    })
  }
}