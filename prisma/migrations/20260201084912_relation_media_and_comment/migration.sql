-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_media_id_fkey`;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_media_id_fkey` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
