-- AlterTable
ALTER TABLE `documents` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `faqs` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `projects` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `deleted_at` DATETIME(3) NULL;
