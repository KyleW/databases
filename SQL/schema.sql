-- DROP DATABASE chat;
CREATE DATABASE chat;

USE chat;

/* You can also create more tables, if you need them... */

/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/

-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'users'
-- 
-- ---

DROP TABLE IF EXISTS `users`;
    
CREATE TABLE `users` (
  `user_id` TINYINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(15) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`)
);

-- ---
-- Table 'messages'
-- 
-- ---

DROP TABLE IF EXISTS `messages`;

CREATE TABLE `messages` (
  `message_id` TINYINT NULL AUTO_INCREMENT DEFAULT NULL,
  `user_id` TINYINT NULL,
  `room_id` TINYINT NULL DEFAULT NULL,
  `text` MEDIUMTEXT NULL DEFAULT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`message_id`)
);

-- ---
-- Table 'rooms'
-- 
-- ---

DROP TABLE IF EXISTS `rooms`;
    
CREATE TABLE `rooms` (
  `room_id` TINYINT NULL AUTO_INCREMENT,
  `roomname` VARCHAR(30),
  PRIMARY KEY (`room_id`)
);

-- ---
-- Table 'befriended'
--
-- ---

DROP TABLE IF EXISTS `befriended`;

CREATE TABLE `befriended` (
  `id` TINYINT NULL AUTO_INCREMENT DEFAULT NULL,
  `user_id` TINYINT NULL DEFAULT NULL,
  `friend_id` TINYINT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE `messages` ADD FOREIGN KEY (user_id) REFERENCES `users` (`user_id`);
ALTER TABLE `messages` ADD FOREIGN KEY (room_id) REFERENCES `rooms` (`id`);
ALTER TABLE `befriended` ADD FOREIGN KEY (user_id) REFERENCES `users` (`user_id`);
ALTER TABLE `befriended` ADD FOREIGN KEY (friend_id) REFERENCES `users` (`user_id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `messages` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `rooms` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `befriended` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `users` (`user_id`,`username`) VALUES
-- ('','');
-- INSERT INTO `messages` (`id`,`user_user_id`,`room_id`,`text`,`createdAt`) VALUES
-- ('','','','','');
-- INSERT INTO `rooms` (`id`,`roomname`) VALUES
-- ('','');
-- INSERT INTO `befriended` (`id`,`user_id`,`friend_id`) VALUES
-- ('','','');

