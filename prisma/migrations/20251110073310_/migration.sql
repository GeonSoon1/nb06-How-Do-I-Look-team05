-- CreateEnum
CREATE TYPE "Category" AS ENUM ('top', 'bottom', 'outer', 'dress', 'shoes', 'bag', 'accessory');

-- CreateTable
CREATE TABLE "Style" (
    "id" TEXT NOT NULL,
    "nickName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "password" TEXT NOT NULL,
    "trendyAverage" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "uniqueAverage" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "practicalAverage" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "costEffectiveAverage" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "totalAverage" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Style_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "category" "Category" NOT NULL,
    "styleId" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "styleCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isThumbnail" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "styleId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curation" (
    "id" TEXT NOT NULL,
    "trendy" INTEGER NOT NULL DEFAULT 0,
    "personality" INTEGER NOT NULL DEFAULT 0,
    "practicality" INTEGER NOT NULL DEFAULT 0,
    "costEffectiveness" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT NOT NULL,
    "nickName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "styleId" TEXT NOT NULL,

    CONSTRAINT "Curation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurationComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,
    "curationId" TEXT NOT NULL,

    CONSTRAINT "CurationComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StyleToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Style_title_description_idx" ON "Style"("title", "description");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_tag_key" ON "Tag"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "CurationComment_curationId_key" ON "CurationComment"("curationId");

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
