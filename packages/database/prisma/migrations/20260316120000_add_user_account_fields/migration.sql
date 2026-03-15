-- AlterTable
ALTER TABLE "User" ADD COLUMN "avatarUrl" TEXT,
ADD COLUMN "username" TEXT,
ADD COLUMN "bio" TEXT,
ADD COLUMN "theme" TEXT DEFAULT 'dark',
ADD COLUMN "lastLoginAt" TIMESTAMP(3),
ADD COLUMN "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
