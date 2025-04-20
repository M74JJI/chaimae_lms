-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_languageId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_subcategoryId_fkey";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "subtitle" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "thumbnail" DROP NOT NULL,
ALTER COLUMN "promotionalVideo" DROP NOT NULL,
ALTER COLUMN "difficultyLevel" DROP NOT NULL,
ALTER COLUMN "subcategoryId" DROP NOT NULL,
ALTER COLUMN "languageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE SET NULL ON UPDATE CASCADE;
