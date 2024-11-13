/*
  Warnings:

  - A unique constraint covering the columns `[postId,userId]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Likes_postId_userId_key" ON "Likes"("postId", "userId");
