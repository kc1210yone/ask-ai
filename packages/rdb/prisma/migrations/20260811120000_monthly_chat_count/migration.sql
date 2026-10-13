-- AlterTable
ALTER TABLE `projects` ADD COLUMN `monthly_chat_count` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `monthly_chat_count_reset_at` DATETIME(3) NULL;
