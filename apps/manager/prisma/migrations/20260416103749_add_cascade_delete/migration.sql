-- DropForeignKey
ALTER TABLE `Document` DROP FOREIGN KEY `Document_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `Faq` DROP FOREIGN KEY `Faq_projectId_fkey`;

-- DropIndex
DROP INDEX `Document_projectId_fkey` ON `Document`;

-- DropIndex
DROP INDEX `Faq_projectId_fkey` ON `Faq`;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Faq` ADD CONSTRAINT `Faq_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
