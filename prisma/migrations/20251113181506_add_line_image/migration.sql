-- CreateTable
CREATE TABLE "LineImage" (
    "id" SERIAL NOT NULL,
    "lineId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LineImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LineImage_lineId_key" ON "LineImage"("lineId");
