/*
  Warnings:

  - The primary key for the `documents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `documents` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(25)`.
  - You are about to alter the column `project_id` on the `documents` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(25)`.
  - The primary key for the `faqs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `faqs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(25)`.
  - You are about to alter the column `project_id` on the `faqs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(25)`.
  - The primary key for the `projects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `projects` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(25)`.
  - You are about to alter the column `user_id` on the `projects` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(25)`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(25)`.
  - You are about to alter the column `cognito_user_id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.

*/
-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `documents_project_id_fkey`;

-- DropForeignKey
ALTER TABLE `faqs` DROP FOREIGN KEY `faqs_project_id_fkey`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_user_id_fkey`;

-- DropIndex
DROP INDEX `documents_project_id_fkey` ON `documents`;

-- DropIndex
DROP INDEX `faqs_project_id_fkey` ON `faqs`;

-- DropIndex
DROP INDEX `projects_user_id_fkey` ON `projects`;

-- AlterTable
ALTER TABLE `documents` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(25) NOT NULL,
    MODIFY `project_id` VARCHAR(25) NOT NULL,
    MODIFY `title` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `faqs` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(25) NOT NULL,
    MODIFY `project_id` VARCHAR(25) NOT NULL,
    MODIFY `question` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `projects` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(25) NOT NULL,
    MODIFY `user_id` VARCHAR(25) NOT NULL,
    MODIFY `name` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(25) NOT NULL,
    MODIFY `cognito_user_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `faqs` ADD CONSTRAINT `faqs_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
