-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 26, 2016 at 11:16 AM
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
(1, 30, '2016-12-25 19:24:53', '???'),
(1, 62, '2016-12-21 13:02:54', 'yes'),
(1, 68, '2016-12-24 15:30:15', 'Yes, another Comment :D'),
(1, 81, '2016-12-22 20:14:21', 'Hey Comment :D'),
(1, 81, '2016-12-23 07:28:22', 'another comment!!'),
(1, 82, '2016-12-22 19:50:11', 'hey'),
(1, 82, '2016-12-22 19:50:42', 'hello'),
(1, 82, '2016-12-22 20:03:16', 'why'),
(1, 82, '2016-12-22 20:03:20', 'hello'),
(1, 82, '2016-12-22 20:03:26', 'there'),
(1, 82, '2016-12-22 20:03:30', 'mister'),
(1, 82, '2016-12-22 20:03:34', 'maroon'),
(1, 82, '2016-12-23 07:00:43', 'why'),
(1, 82, '2016-12-23 07:00:46', 'arent'),
(1, 82, '2016-12-23 07:00:50', 'you'),
(1, 82, '2016-12-23 07:00:52', 'here'),
(1, 82, '2016-12-23 07:00:54', 'yet'),
(1, 82, '2016-12-23 07:00:57', 'ohhh'),
(1, 82, '2016-12-25 20:42:21', '456'),
(4, 81, '2016-12-23 08:02:51', 'and lunch :D'),
(4, 82, '2016-12-23 08:00:56', 'here I am');

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
(1, 5),
(3, 3),
(4, 1),
(4, 4),
(4, 5),
(5, 4),
(5, 5),
(7, 7);

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `user_id` int(11) NOT NULL,
  `photo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`user_id`, `photo_id`) VALUES
(1, 29),
(1, 30),
(1, 68),
(1, 74),
(1, 79),
(1, 80),
(1, 81),
(1, 82),
(1, 83),
(1, 86),
(1, 87),
(1, 88),
(3, 80),
(3, 81),
(4, 68),
(4, 81),
(4, 86),
(5, 67),
(5, 68),
(5, 75),
(5, 81);

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
(0, 92),
(0, 93),
(0, 94),
(0, 95),
(0, 97),
(0, 98),
(1, 81),
(1, 82),
(4, 25),
(4, 26),
(4, 27),
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
(68, '#hello', '2016-12-21 13:19:12'),
(69, '''''', '2016-12-21 13:19:12'),
(70, '''''', '2016-12-21 13:19:12'),
(71, '''''', '2016-12-21 13:19:12'),
(72, '''''', '2016-12-21 13:19:12'),
(74, '''''', '2016-12-21 13:19:12'),
(75, '''DDDDD''', '2016-12-21 13:19:12'),
(79, '''''', '2016-12-21 16:01:08'),
(80, '#hello', '2016-12-21 16:07:48'),
(81, 'Coffee :D', '2016-12-21 16:08:53'),
(82, '', '2016-12-22 19:30:54'),
(83, 'Better Not even describing it....', '2016-12-25 14:04:26'),
(86, '', '2016-12-25 17:15:44'),
(87, '', '2016-12-25 17:15:55'),
(88, 'DDDDJKFNSDKJFN :D', '2016-12-25 19:05:44'),
(92, '', '2016-12-25 19:33:48'),
(93, '', '2016-12-25 19:34:01'),
(94, '', '2016-12-25 19:34:09'),
(95, '', '2016-12-25 19:36:55'),
(97, '', '2016-12-26 09:58:38'),
(98, '', '2016-12-26 10:01:28');

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
(1, 'Han Solo', 'han@solo.com', '1234', '95'),
(3, 'Homer', 'man', 'walking', '98'),
(4, 'Ami Gadha', 'ami@gadha.com', '1234', '70'),
(5, 'Fahim', 'f@h.com', '1234', '97'),
(7, 'Nazia', 'me@mail', '1234', '40');

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
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`user_id`,`photo_id`),
  ADD KEY `photo_id` (`photo_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;
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
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`id`);

--
-- Constraints for table `photoowner`
--
ALTER TABLE `photoowner`
  ADD CONSTRAINT `photoowner_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `photoowner_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
