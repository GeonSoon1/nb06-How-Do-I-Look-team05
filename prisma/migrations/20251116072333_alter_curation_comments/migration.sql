/*
  Warnings:

  - Added the required column `styleId` to the `CurationComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CurationComment" ADD COLUMN     "styleId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CurationComment" ADD CONSTRAINT "CurationComment_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;
