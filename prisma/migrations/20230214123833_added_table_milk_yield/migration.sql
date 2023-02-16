-- CreateTable
CREATE TABLE "Farm"."Milk_Yield" (
    "id" SERIAL NOT NULL,
    "cattle_id" INTEGER NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "cattleId" INTEGER NOT NULL,

    CONSTRAINT "Milk_Yield_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Farm"."Milk_Yield" ADD CONSTRAINT "Milk_Yield_cattleId_fkey" FOREIGN KEY ("cattleId") REFERENCES "Farm"."Cattle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
