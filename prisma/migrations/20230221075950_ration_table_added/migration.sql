-- CreateTable
CREATE TABLE "Farm"."Ration" (
    "id" SERIAL NOT NULL,
    "ration_name" TEXT NOT NULL,
    "kilograms" INTEGER NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "approx_daily_usage" INTEGER,
    "month" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "farm_id" INTEGER NOT NULL,

    CONSTRAINT "Ration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Farm"."Ration" ADD CONSTRAINT "Ration_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "Farm"."Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
