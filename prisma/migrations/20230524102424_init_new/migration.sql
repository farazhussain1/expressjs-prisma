-- AlterTable
ALTER TABLE "Event"."Events" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event"."Events" ADD CONSTRAINT "Events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Auth"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
