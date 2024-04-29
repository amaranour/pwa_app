/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

/* USER */
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `username` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(100) NOT NULL,
  `avatar` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=MariaDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `user`;
INSERT INTO `user` (`user_id`, `first_name`, `last_name`, `username`, `password`, `salt`, `avatar`) VALUES
    (1, 'Stu', 'Dent', 'student', '83d9bdb5e20f3571b087db9aabf190a296741c3e864d7742f35658cfccc1b79c4599aad25084aa9a28c649a50c92244227b3e53e197621301d619d1ea01873c4', '48c8947f69c054a5caa934674ce8881d02bb18fb59d5a63eeaddff735b0e9', 'https://robohash.org/veniamdoloresenim.png?size=64x64&set=set1'),
    (2, 'Gra', 'Duate', 'graduate', 'e289219c34f9a32ebc82393f09719b7f34872de95463242b5ffe8bb4b11a5fe7d454f9f5d082c8207c5d69b220ba06624b4bb15ffa05cc7d7d53c43f9e96da6a', '801e87294783281ae49fc8287a0fd86779b27d7972d3e84f0fa0d826d7cb67dfefc', 'https://robohash.org/nullaautemin.png?size=64x64&set=set1');

/* RECIPES */
CREATE TABLE IF NOT EXISTS `recipes` (
  `rec_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '0',
  `fat` int(5) unsigned NOT NULL DEFAULT '0',
  `protein` int(5) unsigned NOT NULL DEFAULT '0',
  `carbs` int(5) unsigned NOT NULL DEFAULT '0',
  `cals` int(5) unsigned NOT NULL DEFAULT '0',
  `user_id` int(5) unsigned NOT NULL,
  PRIMARY KEY (`rec_id`)
) ENGINE=MariaDB DEFAULT CHARSET=utf8mb4;


/**
    Recipe 1's name is Mac N Cheese and has 5g of fat, 10g of protein, 12g of carbs, and 250 cals.
    Recipe 2's name is Chicken Algredo and has 8g of fat, 15g of protein, 15g of carbs, and 300 cals.
    Recipe 3's name is Spaghetti and has 6g of fat, 7g of protein, 12g of carbs, and 300 cals.
    Recipe 4's name is Scrambled Eggs and has 6g of fat, 8g of protein, 3g of carbs, and 150 cals.

**/
DELETE FROM `recipes`;
INSERT INTO `recipes` (`rec_id`, `name`, `fat`, `protein`, `carbs`, `cals`, `user_id`) VALUES
            (1, 'Mac N Cheese', 5, 10, 12, 250, 1),
            (2, 'Chicken Alfredo', 8, 15, 15, 300, 1),
            (3, 'Spaghetti', 6, 7, 12, 300, 2),
            (4, 'Scrambled Eggs', 6, 8, 3, 150, 2);

/* USER TO RECIPE */
CREATE TABLE IF NOT EXISTS `user_recipes` (
  `user_recipe_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `recipe_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`user_recipe_id`)
) ENGINE=MariaDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `user_recipes`;
INSERT INTO `user_recipes` (`user_recipe_id`, `user_id`, `recipe_id`) VALUES
  (1, 1, 1),
  (2, 1, 2),
  (3, 2, 3),
  (4, 2, 4);

/* MEALS/CONSUMPTION */
CREATE TABLE IF NOT EXISTS `meals` (
  `meals_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `date` DATE NOT NULL,
  `rec_id` int(11) unsigned NOT NULL,
   PRIMARY KEY (`meals_id`)

) ENGINE=MariaDB DEFAULT CHARSET=utf8mb4;

/**
  User 1's current meal number is 2, yesterday they ate recipes 1 and 2. Today they only ate recipes 1.
  User 2's current meal number is 1. Today they ate recipes 3 and 4.

  We will store consumption for the last 7 days (e.g. user 1 could have meal numbers 5-11), removing the 
  lowest meal number of a given user once the 8th day comes. The highest meal number of a given user will 
  be the current day.
**/
DELETE FROM `meals`;
INSERT INTO `meals` (`meals_id`, `user_id`, `date`, `rec_id`) VALUES
  (1, 1, '2024-04-16', 1),
  (2, 1, '2024-04-16', 2),
  (3, 1, '2024-04-16', 1),
  (4, 2, '2024-04-16', 3),
  (5, 2, '2024-04-16', 4);

/* STATS */
CREATE TABLE IF NOT EXISTS `stats` (
  `stats_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `height` int(6) unsigned NOT NULL,
  `weight` int(6) unsigned NOT NULL,
  `cal_goal` int(5) unsigned NOT NULL,
  `protein_goal` int(5) unsigned NOT NULL,
  `carb_goal` int(5) unsigned NOT NULL,
  `fat_goal` int(5) unsigned NOT NULL,
   PRIMARY KEY (`stats_id`)
) ENGINE=MariaDB DEFAULT CHARSET=utf8mb4;


/**
    User 1 is 72 inches tall and weight in at 180lbs. Their calorie goal is 2000/day along with 150g of protein
    50 grams of carbs, and 20g of fat per day respectively.

    User 2 is 68 inches tall and weight in at 150lbs. Their calorie goal is 1300/day along with 120g of protein
    30 grams of carbs, and 25g of fat per day respectively.
**/
DELETE FROM `stats`;
INSERT INTO `stats` (`stats_id`, `user_id`, `height`, `weight`, `cal_goal`, `protein_goal`, `carb_goal`, `fat_goal`) VALUES
    (1, 1, 72, 180, 2000, 150, 50, 20),
    (2, 2, 68, 150, 1300, 120, 30, 25);