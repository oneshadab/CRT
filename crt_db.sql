-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 21, 2016 at 08:57 PM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 5.6.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crt_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `user_id` int(11) NOT NULL,
  `photo_id` int(11) NOT NULL,
  `moment` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `description` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`user_id`, `photo_id`, `moment`, `description`) VALUES
(1, 62, '2016-12-21 13:02:54', 'yes'),
(1, 73, '2016-12-21 12:47:32', 'what?'),
(1, 73, '2016-12-21 13:02:03', 'ha'),
(1, 73, '2016-12-21 13:02:07', 'a'),
(1, 74, '0000-00-00 00:00:00', 'hello'),
(1, 74, '2016-12-21 12:06:18', 'ad'),
(1, 74, '2016-12-21 12:06:29', 'world'),
(1, 74, '2016-12-21 13:02:44', 'ha'),
(1, 75, '2016-12-21 13:21:31', 'as');

-- --------------------------------------------------------

--
-- Table structure for table `follows`
--

CREATE TABLE `follows` (
  `follower_id` int(11) NOT NULL,
  `following_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `follows`
--

INSERT INTO `follows` (`follower_id`, `following_id`) VALUES
(1, 1),
(1, 4),
(4, 1),
(4, 4);

-- --------------------------------------------------------

--
-- Table structure for table `photoowner`
--

CREATE TABLE `photoowner` (
  `user_id` int(11) NOT NULL,
  `photo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `photoowner`
--

INSERT INTO `photoowner` (`user_id`, `photo_id`) VALUES
(0, 44),
(0, 46),
(0, 64),
(0, 65),
(0, 66),
(0, 70),
(0, 71),
(0, 72),
(1, 73),
(1, 74),
(1, 75),
(1, 77),
(1, 78),
(1, 79),
(1, 80),
(1, 81),
(4, 25),
(4, 26),
(4, 27),
(4, 67),
(4, 68),
(5, 29),
(5, 30),
(7, 40);

-- --------------------------------------------------------

--
-- Table structure for table `photos`
--

CREATE TABLE `photos` (
  `id` int(11) NOT NULL,
  `description` varchar(1000) NOT NULL DEFAULT '''''',
  `moment` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `photos`
--

INSERT INTO `photos` (`id`, `description`, `moment`) VALUES
(12, '''''', '2016-12-21 13:19:12'),
(13, '''''', '2016-12-21 13:19:12'),
(14, '''''', '2016-12-21 13:19:12'),
(15, '''''', '2016-12-21 13:19:12'),
(16, '''''', '2016-12-21 13:19:12'),
(17, '''''', '2016-12-21 13:19:12'),
(18, '''''', '2016-12-21 13:19:12'),
(19, '''''', '2016-12-21 13:19:12'),
(20, '''''', '2016-12-21 13:19:12'),
(21, '''''', '2016-12-21 13:19:12'),
(22, '''''', '2016-12-21 13:19:12'),
(23, '''''', '2016-12-21 13:19:12'),
(24, '''''', '2016-12-21 13:19:12'),
(25, '''''', '2016-12-21 13:19:12'),
(26, '''''', '2016-12-21 13:19:12'),
(27, '''''', '2016-12-21 13:19:12'),
(28, '''''', '2016-12-21 13:19:12'),
(29, '''''', '2016-12-21 13:19:12'),
(30, '''''', '2016-12-21 13:19:12'),
(31, '''''', '2016-12-21 13:19:12'),
(32, '''''', '2016-12-21 13:19:12'),
(33, '''''', '2016-12-21 13:19:12'),
(34, '''''', '2016-12-21 13:19:12'),
(35, '''''', '2016-12-21 13:19:12'),
(36, '''''', '2016-12-21 13:19:12'),
(37, '''''', '2016-12-21 13:19:12'),
(38, '''''', '2016-12-21 13:19:12'),
(39, '''''', '2016-12-21 13:19:12'),
(40, '''''', '2016-12-21 13:19:12'),
(41, '''''', '2016-12-21 13:19:12'),
(42, '''''', '2016-12-21 13:19:12'),
(44, '''''', '2016-12-21 13:19:12'),
(45, '''''', '2016-12-21 13:19:12'),
(46, '''''', '2016-12-21 13:19:12'),
(47, '''''', '2016-12-21 13:19:12'),
(48, '''''', '2016-12-21 13:19:12'),
(49, '''''', '2016-12-21 13:19:12'),
(50, '''''', '2016-12-21 13:19:12'),
(51, '''''', '2016-12-21 13:19:12'),
(52, '''''', '2016-12-21 13:19:12'),
(53, '''''', '2016-12-21 13:19:12'),
(54, '''''', '2016-12-21 13:19:12'),
(55, '''''', '2016-12-21 13:19:12'),
(56, '''''', '2016-12-21 13:19:12'),
(57, '''''', '2016-12-21 13:19:12'),
(58, '''''', '2016-12-21 13:19:12'),
(59, '''''', '2016-12-21 13:19:12'),
(60, '''''', '2016-12-21 13:19:12'),
(61, '''''', '2016-12-21 13:19:12'),
(62, '''''', '2016-12-21 13:19:12'),
(63, '''''', '2016-12-21 13:19:12'),
(64, '''''', '2016-12-21 13:19:12'),
(65, '''''', '2016-12-21 13:19:12'),
(66, '''''', '2016-12-21 13:19:12'),
(67, '''''', '2016-12-21 13:19:12'),
(68, '''''', '2016-12-21 13:19:12'),
(69, '''''', '2016-12-21 13:19:12'),
(70, '''''', '2016-12-21 13:19:12'),
(71, '''''', '2016-12-21 13:19:12'),
(72, '''''', '2016-12-21 13:19:12'),
(73, '''''', '2016-12-21 13:19:12'),
(74, '''''', '2016-12-21 13:19:12'),
(75, '''DDDDD''', '2016-12-21 13:19:12'),
(77, '''''', '2016-12-21 16:00:32'),
(78, '''''', '2016-12-21 16:00:44'),
(79, '''''', '2016-12-21 16:01:08'),
(80, 'Breakfast!!', '2016-12-21 16:07:48'),
(81, 'Coffee :D', '2016-12-21 16:08:53');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(1000) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `pass` varchar(100) DEFAULT NULL,
  `avatar` varchar(1000) NOT NULL DEFAULT 'test_pro_pic'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `pass`, `avatar`) VALUES
(0, 'admin', 'admin@admin.com', '1234', 'test_pro_pic'),
(1, 'Han Solo', 'han@solo.com', '1234', '72'),
(2, 'hello', 'hello@world.com', 'world', 'test_pro_pic'),
(3, 'dead', 'man', 'walking', 'test_pro_pic'),
(4, 'Ami Gadh', 'ami@gadha.com', '1234', '70'),
(5, 'Fahima Akter', 'f@h.com', '1234', 'test_pro_pic'),
(7, 'my@me', 'me@mail', '1234', '40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`user_id`,`photo_id`,`moment`),
  ADD KEY `photo_id` (`photo_id`);

--
-- Indexes for table `follows`
--
ALTER TABLE `follows`
  ADD PRIMARY KEY (`follower_id`,`following_id`),
  ADD KEY `following_id` (`following_id`);

--
-- Indexes for table `photoowner`
--
ALTER TABLE `photoowner`
  ADD PRIMARY KEY (`user_id`,`photo_id`),
  ADD KEY `photo_id` (`photo_id`);

--
-- Indexes for table `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`id`);

--
-- Constraints for table `follows`
--
ALTER TABLE `follows`
  ADD CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`following_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `photoowner`
--
ALTER TABLE `photoowner`
  ADD CONSTRAINT `photoowner_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `photoowner_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
