-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_parent_id_fkey`;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
