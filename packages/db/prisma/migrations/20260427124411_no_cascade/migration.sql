-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `documents_project_id_fkey`;

-- DropForeignKey
ALTER TABLE `faqs` DROP FOREIGN KEY `faqs_project_id_fkey`;

-- DropIndex
DROP INDEX `documents_project_id_fkey` ON `documents`;

-- DropIndex
DROP INDEX `faqs_project_id_fkey` ON `faqs`;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `faqs` ADD CONSTRAINT `faqs_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
