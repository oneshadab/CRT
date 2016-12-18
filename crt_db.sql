-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 18, 2016 at 08:09 PM
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
(1, 12),
(1, 13),
(1, 14),
(1, 16),
(1, 32),
(1, 36),
(4, 25),
(4, 26),
(4, 27),
(5, 29),
(5, 30),
(7, 40);

-- --------------------------------------------------------

--
-- Table structure for table `photos`
--

CREATE TABLE `photos` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `photos`
--

INSERT INTO `photos` (`id`) VALUES
(12),
(13),
(14),
(15),
(16),
(17),
(18),
(19),
(20),
(21),
(22),
(23),
(24),
(25),
(26),
(27),
(28),
(29),
(30),
(31),
(32),
(33),
(34),
(35),
(36),
(37),
(38),
(39),
(40),
(41),
(42),
(44),
(45),
(46),
(47);

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
(1, 'Han Solo', 'han@solo.com', '1234', '46'),
(2, 'hello', 'hello@world.com', 'world', 'test_pro_pic'),
(3, 'dead', 'man', 'walking', 'test_pro_pic'),
(4, 'Ami Gadha', 'ami@gadha.com', '1234', 'test_pro_pic'),
(5, 'Fahima Akter', 'f@h.com', '1234', 'test_pro_pic'),
(6, '', '', '', 'test_pro_pic'),
(7, 'my@me', 'me@mail', '1234', '40');

--
-- Indexes for dumped tables
--

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `photoowner`
--
ALTER TABLE `photoowner`
  ADD CONSTRAINT `photoowner_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `photoowner_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
