/*
  Warnings:

  - You are about to drop the column `monthly_chat_count` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `monthly_chat_count_reset_at` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `projects` DROP COLUMN `monthly_chat_count`,
    DROP COLUMN `monthly_chat_count_reset_at`;
