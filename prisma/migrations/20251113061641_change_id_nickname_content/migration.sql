/*
  Warnings:

  - The primary key for the `Curation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `nickName` on the `Curation` table. All the data in the column will be lost.
  - The `id` column on the `Curation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CurationComment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CurationComment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Image` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Style` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Style` table. All the data in the column will be lost.
  - You are about to drop the column `nickName` on the `Style` table. All the data in the column will be lost.
  - The `id` column on the `Style` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Tag` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `nickname` to the `Curation` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `styleId` on the `Curation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `curationId` on the `CurationComment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `styleId` on the `Image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `styleId` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `nickname` to the `Style` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `A` on the `_StyleToTag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_StyleToTag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Curation" DROP CONSTRAINT "Curation_styleId_fkey";

-- DropForeignKey
ALTER TABLE "CurationComment" DROP CONSTRAINT "CurationComment_curationId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_styleId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_styleId_fkey";

-- DropForeignKey
ALTER TABLE "_StyleToTag" DROP CONSTRAINT "_StyleToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_StyleToTag" DROP CONSTRAINT "_StyleToTag_B_fkey";

-- DropIndex
DROP INDEX "Style_title_description_idx";

-- AlterTable
ALTER TABLE "Curation" DROP CONSTRAINT "Curation_pkey",
DROP COLUMN "nickName",
ADD COLUMN     "nickname" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "styleId",
ADD COLUMN     "styleId" INTEGER NOT NULL,
ADD CONSTRAINT "Curation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CurationComment" DROP CONSTRAINT "CurationComment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "curationId",
ADD COLUMN     "curationId" INTEGER NOT NULL,
ADD CONSTRAINT "CurationComment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Image" DROP CONSTRAINT "Image_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "styleId",
ADD COLUMN     "styleId" INTEGER NOT NULL,
ADD CONSTRAINT "Image_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Item" DROP CONSTRAINT "Item_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "styleId",
ADD COLUMN     "styleId" INTEGER NOT NULL,
ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Style" DROP CONSTRAINT "Style_pkey",
DROP COLUMN "description",
DROP COLUMN "nickName",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "nickname" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Style_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Tag_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_StyleToTag" DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL,
DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CurationComment_curationId_key" ON "CurationComment"("curationId");

-- CreateIndex
CREATE INDEX "Style_title_content_idx" ON "Style"("title", "content");

-- CreateIndex
CREATE UNIQUE INDEX "_StyleToTag_AB_unique" ON "_StyleToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_StyleToTag_B_index" ON "_StyleToTag"("B");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curation" ADD CONSTRAINT "Curation_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurationComment" ADD CONSTRAINT "CurationComment_curationId_fkey" FOREIGN KEY ("curationId") REFERENCES "Curation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StyleToTag" ADD CONSTRAINT "_StyleToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StyleToTag" ADD CONSTRAINT "_StyleToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
