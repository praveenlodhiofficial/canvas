/*
  Warnings:

  - You are about to drop the column `radius` on the `Shape` table. All the data in the column will be lost.
  - You are about to drop the column `style` on the `Shape` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ShapeType" ADD VALUE 'LINE';
ALTER TYPE "ShapeType" ADD VALUE 'SELECTION';

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Shape" DROP COLUMN "radius",
DROP COLUMN "style",
ALTER COLUMN "type" DROP DEFAULT;
