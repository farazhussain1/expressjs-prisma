-- CreateEnum
CREATE TYPE "Event"."EventStatus" AS ENUM ('Pending', 'Done', 'Cancel');

-- AlterTable
ALTER TABLE "Event"."Events" ADD COLUMN     "status" "Event"."EventStatus" NOT NULL DEFAULT 'Pending';
