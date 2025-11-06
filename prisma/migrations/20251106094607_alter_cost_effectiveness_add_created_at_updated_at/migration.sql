/*
  Warnings:

  - You are about to drop the column `costEffectivness` on the `Curation` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Curation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Curation" DROP COLUMN "costEffectivness",
ADD COLUMN     "costEffectiveness" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
