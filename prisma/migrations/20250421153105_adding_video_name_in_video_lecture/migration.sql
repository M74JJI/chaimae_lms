/*
  Warnings:

  - Added the required column `videoName` to the `VideoLecture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoLecture" ADD COLUMN     "videoName" TEXT NOT NULL;
