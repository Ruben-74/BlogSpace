-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 11 sep. 2024 à 15:21
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `blog_project`
--

-- --------------------------------------------------------

--
-- Structure de la table `post`
--

DROP TABLE IF EXISTS `post`;
CREATE TABLE IF NOT EXISTS `post` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `publish_date` datetime NOT NULL,
  `author` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'admin',
  `user_id` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `post`
--

INSERT INTO `post` (`id`, `title`, `description`, `publish_date`, `author`, `user_id`) VALUES
(2, 'mise a jour', 'mise', '2024-09-11 17:18:21', '', 1),
(11, 'Le design web UI/UX Design', 'Le design web a toujours été en constante évolution, et 2024 ne fait pas exception. Cette année, nous assistons à une série de nouvelles tendances qui façonnent la manière dont nous interagissons avec les sites web. De l\'esthétique épurée à la fonctionnalité avancée, découvrons ce que nous réserve le futur du design web.', '2024-09-10 00:00:00', '', 1),
(12, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:22:58', 'admin', 1),
(13, 'frefe', 'efezefef', '2024-09-11 15:24:41', 'admin', 1),
(14, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:47:47', 'admin', 1),
(15, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:48:34', 'admin', 1),
(16, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:48:59', 'admin', 1),
(17, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:49:56', 'admin', 1),
(18, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:50:13', 'admin', 1),
(19, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:50:40', 'admin', 1),
(20, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:50:47', 'admin', 1),
(21, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:51:25', 'admin', 1),
(22, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:51:51', 'admin', 1),
(23, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:52:25', 'admin', 1),
(24, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:52:33', 'admin', 1),
(25, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:53:10', 'admin', 1),
(26, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:53:29', 'admin', 1),
(27, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:53:47', 'admin', 1),
(28, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:53:53', 'admin', 1),
(29, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:54:31', 'admin', 1),
(30, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:56:03', 'admin', 1),
(31, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:57:04', 'admin', 1),
(32, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 15:59:04', 'admin', 1),
(33, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 16:01:19', 'admin', 1),
(34, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 16:01:33', 'admin', 1),
(35, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 16:02:14', 'admin', 1),
(36, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 16:03:43', 'admin', 1),
(37, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 16:06:37', 'admin', 1),
(38, 'efzdfzdf', 'zdzdzdzdzd', '2024-09-11 16:08:01', 'admin', 1);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
