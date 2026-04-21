-- Drop foreign keys before renaming columns
ALTER TABLE `project` DROP FOREIGN KEY `Project_userId_fkey`;
ALTER TABLE `document` DROP FOREIGN KEY `Document_projectId_fkey`;
ALTER TABLE `faq` DROP FOREIGN KEY `Faq_projectId_fkey`;

-- Rename columns in `user`
ALTER TABLE `user` RENAME COLUMN `createdAt` TO `created_at`;
ALTER TABLE `user` RENAME COLUMN `updatedAt` TO `updated_at`;

-- Rename columns in `project`
ALTER TABLE `project` RENAME COLUMN `userId` TO `user_id`;
ALTER TABLE `project` RENAME COLUMN `createdAt` TO `created_at`;
ALTER TABLE `project` RENAME COLUMN `updatedAt` TO `updated_at`;

-- Rename columns in `document`
ALTER TABLE `document` RENAME COLUMN `projectId` TO `project_id`;
ALTER TABLE `document` RENAME COLUMN `createdAt` TO `created_at`;
ALTER TABLE `document` RENAME COLUMN `updatedAt` TO `updated_at`;

-- Rename columns in `faq`
ALTER TABLE `faq` RENAME COLUMN `projectId` TO `project_id`;
ALTER TABLE `faq` RENAME COLUMN `createdAt` TO `created_at`;
ALTER TABLE `faq` RENAME COLUMN `updatedAt` TO `updated_at`;

-- Re-add foreign keys with new column names
ALTER TABLE `project` ADD CONSTRAINT `project_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `document` ADD CONSTRAINT `document_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `faq` ADD CONSTRAINT `faq_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
