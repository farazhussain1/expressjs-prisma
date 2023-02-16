-- CreateTable
CREATE TABLE "Farm"."Cattle" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "current_status" TEXT NOT NULL,
    "no_of_Deliveries" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "farm_id" INTEGER NOT NULL,

    CONSTRAINT "Cattle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Farm"."Cattle" ADD CONSTRAINT "Cattle_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "Farm"."Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
