-- CreateTable
CREATE TABLE "Auth"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auth"."Profile" (
    "id" SERIAL NOT NULL,
    "number" TEXT,
    "country" TEXT NOT NULL,
    "state" TEXT,
    "city" TEXT,
    "district" TEXT,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "Auth"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Auth"."Profile"("userId");

-- AddForeignKey
ALTER TABLE "Auth"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Auth"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
