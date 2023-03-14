-- CreateEnum
CREATE TYPE "Farm"."RationCategory" AS ENUM ('grainMix', 'hay', 'cornSillage', 'water');

-- CreateTable
CREATE TABLE "Farm"."Farm" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "farmName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Farm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farm"."Cattle" (
    "id" SERIAL NOT NULL,
    "farmId" INTEGER NOT NULL,
    "idNumber" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "age" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "vaccinated" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cattle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farm"."MilkYield" (
    "id" SERIAL NOT NULL,
    "cattleId" INTEGER NOT NULL,
    "milkInLitres" DECIMAL(65,30) NOT NULL,
    "milkYieldDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MilkYield_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farm"."Ration" (
    "id" SERIAL NOT NULL,
    "farmId" INTEGER NOT NULL,
    "rationCategory" "Farm"."RationCategory" NOT NULL,
    "kilograms" INTEGER NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Farm"."Cattle" ADD CONSTRAINT "Cattle_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"."Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farm"."MilkYield" ADD CONSTRAINT "MilkYield_cattleId_fkey" FOREIGN KEY ("cattleId") REFERENCES "Farm"."Cattle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farm"."Ration" ADD CONSTRAINT "Ration_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"."Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
