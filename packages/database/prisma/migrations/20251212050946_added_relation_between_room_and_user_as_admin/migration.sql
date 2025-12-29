/*
  Warnings:

  - You are about to drop the column `createdById` on the `Room` table. All the data in the column will be lost.
  - Added the required column `adminId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_createdById_fkey";

-- DropIndex
DROP INDEX "Room_createdById_idx";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "createdById",
ADD COLUMN     "adminId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Room_adminId_idx" ON "Room"("adminId");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
