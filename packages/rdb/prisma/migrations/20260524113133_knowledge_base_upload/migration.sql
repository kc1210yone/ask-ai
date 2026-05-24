-- AlterTable
ALTER TABLE `projects` ADD COLUMN `knowledge_base_is_uploading` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `knowledge_base_last_upload_date_time` DATETIME(3) NULL;
