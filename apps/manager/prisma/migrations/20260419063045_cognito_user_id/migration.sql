/*
  Warnings:

  - You are about to drop the column `cognito_sub` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cognito_user_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `user_cognito_sub_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `cognito_sub`,
    ADD COLUMN `cognito_user_id` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `user_cognito_user_id_key` ON `user`(`cognito_user_id`);
