import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient()

export class UserService {
  constructor() { }

  get(data: User) {
    return prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { id: data.id }]
      },
      select: { id: true, username: true, email: true, password: true, isVerified: true, created_at: true, updated_at: true, Profile: { select: { country: true } } }
    });
  }

  isExists(email: string) {
    return prisma.user.findFirst({ where: { email: email } });
  }

  create(user: any) {
    return prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
        Profile: {
          create: {
            country: user.country,
          }
        }
      }
    }
    )
  }

  delete(email: string) {
    return prisma.user.delete({ where: { email: email } })
  }

  update(email: string, data: any) {
    return prisma.user.update({
      where: { email: email },
      data: data
    })
  }
}