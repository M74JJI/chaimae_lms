/*
  Warnings:

  - You are about to drop the column `slug` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Subcategory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `Subcategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Subcategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Category_slug_key";

-- DropIndex
DROP INDEX "Subcategory_slug_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "slug",
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subcategory" DROP COLUMN "slug",
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_url_key" ON "Category"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Subcategory_url_key" ON "Subcategory"("url");
