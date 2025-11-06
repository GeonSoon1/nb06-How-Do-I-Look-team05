/*
  Warnings:

  - You are about to drop the column `average` on the `Curation` table. All the data in the column will be lost.
  - You are about to drop the column `costEffective` on the `Curation` table. All the data in the column will be lost.
  - You are about to drop the column `practical` on the `Curation` table. All the data in the column will be lost.
  - You are about to drop the column `unique` on the `Curation` table. All the data in the column will be lost.
  - You are about to drop the column `lookbookCount` on the `Tag` table. All the data in the column will be lost.
  - Added the required column `nickName` to the `Style` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Curation" DROP COLUMN "average",
DROP COLUMN "costEffective",
DROP COLUMN "practical",
DROP COLUMN "unique",
ADD COLUMN     "costEffectivness" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "personality" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "practicality" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Style" ADD COLUMN     "costEffectiveAverage" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
ADD COLUMN     "nickName" TEXT NOT NULL,
ADD COLUMN     "practicalAverage" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
ADD COLUMN     "totalAverage" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
ADD COLUMN     "trendyAverage" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
ADD COLUMN     "uniqueAverage" DECIMAL(65,30) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "lookbookCount",
ADD COLUMN     "clickCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "styleCount" INTEGER NOT NULL DEFAULT 0;
