# ************************************************************
# Sequel Pro SQL dump
# Version 4529
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.11)
# Database: klasedb
# Generation Time: 2016-05-05 05:43:47 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table Chat
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Chat`;

CREATE TABLE `Chat` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user` varchar(60) DEFAULT NULL,
  `message` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `Chat` WRITE;
/*!40000 ALTER TABLE `Chat` DISABLE KEYS */;

INSERT INTO `Chat` (`id`, `user`, `message`)
VALUES
	(1,'Terri Johnson Ayala','test message!'),
	(2,'Juan Marquez Cruz','test back'),
	(3,'Juan Marquez Cruz','helow'),
	(4,'Terri Johnson Ayala','pls wrk');

/*!40000 ALTER TABLE `Chat` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_admin
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_admin`;

CREATE TABLE `t_admin` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sex` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `f_name` varchar(255) DEFAULT NULL,
  `m_name` varchar(255) DEFAULT NULL,
  `l_name` varchar(255) DEFAULT NULL,
  `admin_no` varchar(255) DEFAULT NULL,
  `encrypted_password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table t_assignment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_assignment`;

CREATE TABLE `t_assignment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(60) DEFAULT NULL,
  `message` varchar(100) DEFAULT NULL,
  `mark` int(11) DEFAULT NULL,
  `file` varchar(100) DEFAULT NULL,
  `filename` varchar(100) DEFAULT NULL,
  `post_date` datetime DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `poster` int(11) DEFAULT NULL,
  `poster_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `t_assignment` WRITE;
/*!40000 ALTER TABLE `t_assignment` DISABLE KEYS */;

INSERT INTO `t_assignment` (`id`, `title`, `message`, `mark`, `file`, `filename`, `post_date`, `due_date`, `section_id`, `poster`, `poster_id`)
VALUES
	(2,'xcxce','fefef',12,'exer10-confmatrix.csv','Thu Apr 28 2016 19:07:09 GMT+0800 (PHT) - exer10-confmatrix.csv','2016-04-28 19:07:09','2016-04-29 00:00:00',1,2,2),
	(3,'titleee','232sd sdd',12,NULL,NULL,'2016-04-28 19:26:51','2016-04-29 00:59:00',1,2,2),
	(4,'lab act','test ljdsfksdf',20,NULL,NULL,'2016-04-30 23:50:07','2016-04-30 16:20:00',2,2,2);

/*!40000 ALTER TABLE `t_assignment` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_assignment_submission
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_assignment_submission`;

CREATE TABLE `t_assignment_submission` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(60) DEFAULT NULL,
  `message` varchar(100) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `file` varchar(100) DEFAULT NULL,
  `filename` varchar(100) DEFAULT NULL,
  `post_date` datetime DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL,
  `student` int(11) DEFAULT NULL,
  `assignment_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `t_assignment_submission` WRITE;
/*!40000 ALTER TABLE `t_assignment_submission` DISABLE KEYS */;

INSERT INTO `t_assignment_submission` (`id`, `title`, `message`, `score`, `file`, `filename`, `post_date`, `student_id`, `student`, `assignment_id`)
VALUES
	(2,'this isa adsngm','teste rj d jf gfd g!!',13,NULL,NULL,'2016-04-30 17:56:53',1,1,3),
	(3,'my assgnmt','test test etst',15,'Credits.txt','Sat Apr 30 2016 22:10:23 GMT+0800 (PHT) - Credits.txt','2016-04-30 22:10:23',4,4,3),
	(4,'ass 2','submitted',12,'Capture.PNG','Sun May 01 2016 13:23:30 GMT+0800 (PHT) - Capture.PNG','2016-05-01 13:23:30',1,1,2);

/*!40000 ALTER TABLE `t_assignment_submission` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_event
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_event`;

CREATE TABLE `t_event` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(60) DEFAULT NULL,
  `message` varchar(300) DEFAULT NULL,
  `schedule` datetime DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `section` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `t_event` WRITE;
/*!40000 ALTER TABLE `t_event` DISABLE KEYS */;

INSERT INTO `t_event` (`id`, `title`, `message`, `schedule`, `deadline`, `section_id`, `section`)
VALUES
	(1,'test title','this is a test event bal blabalba lbabal','2016-05-06 11:30:00','2016-05-07 23:30:00',1,1),
	(2,'another test','jsnfkjskjsh','2016-05-09 01:00:00','2016-05-09 12:59:00',2,2),
	(3,'sdfd','dfdf','2016-05-10 00:59:00','2016-05-10 12:00:00',2,2);

/*!40000 ALTER TABLE `t_event` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_message
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_message`;

CREATE TABLE `t_message` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `message` varchar(300) DEFAULT NULL,
  `post_date` datetime DEFAULT NULL,
  `seen` tinyint(1) DEFAULT NULL,
  `thread_id` int(11) DEFAULT NULL,
  `sender` int(11) DEFAULT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `receiver` int(11) DEFAULT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `t_message` WRITE;
/*!40000 ALTER TABLE `t_message` DISABLE KEYS */;

INSERT INTO `t_message` (`id`, `message`, `post_date`, `seen`, `thread_id`, `sender`, `sender_id`, `receiver`, `receiver_id`)
VALUES
	(1,'test message!','2016-05-02 17:35:26',NULL,1,2,2,1,1),
	(2,'test back','2016-05-02 17:36:25',NULL,1,1,1,2,2),
	(3,'another test','2016-05-03 15:33:15',NULL,2,2,2,3,3),
	(4,'helow','2016-05-03 17:06:07',NULL,1,1,1,2,2),
	(5,'pls wrk','2016-05-03 17:10:33',NULL,1,2,2,1,1),
	(6,'ajajaja','2016-05-03 17:27:15',NULL,1,1,1,2,2),
	(7,'hhuhuh','2016-05-03 17:35:12',NULL,1,2,2,1,1),
	(8,'gumana?','2016-05-03 17:43:04',NULL,1,1,1,2,2),
	(9,'yey','2016-05-03 17:43:18',NULL,2,2,2,3,3),
	(10,'oo yata','2016-05-03 17:58:04',NULL,1,1,1,2,2),
	(11,'ayos gumagana na','2016-05-03 17:58:24',NULL,1,2,2,1,1),
	(12,'hi there','2016-05-03 19:23:34',NULL,3,2,2,5,5),
	(13,'woooashd','2016-05-03 19:39:50',NULL,10,4,4,2,2),
	(14,'wohoooy','2016-05-03 19:40:06',NULL,10,4,4,2,2),
	(15,'yeee boii','2016-05-03 19:40:24',NULL,10,2,2,4,4);

/*!40000 ALTER TABLE `t_message` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_message_thread
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_message_thread`;

CREATE TABLE `t_message_thread` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `seen` tinyint(1) DEFAULT NULL,
  `participant1` int(11) DEFAULT NULL,
  `participant1_id` int(11) DEFAULT NULL,
  `participant2` int(11) DEFAULT NULL,
  `participant2_id` int(11) DEFAULT NULL,
  `last_activity` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `t_message_thread` WRITE;
/*!40000 ALTER TABLE `t_message_thread` DISABLE KEYS */;

INSERT INTO `t_message_thread` (`id`, `seen`, `participant1`, `participant1_id`, `participant2`, `participant2_id`, `last_activity`)
VALUES
	(1,NULL,2,2,1,1,'2016-05-03 17:58:24'),
	(2,NULL,2,2,3,3,'2016-05-03 17:43:18'),
	(3,NULL,2,2,5,5,'2016-05-03 19:23:34'),
	(10,NULL,4,4,2,2,'2016-05-03 19:40:24');

/*!40000 ALTER TABLE `t_message_thread` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_post
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_post`;

CREATE TABLE `t_post` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `message` varchar(600) DEFAULT NULL,
  `file` varchar(120) DEFAULT NULL,
  `filename` varchar(120) DEFAULT NULL,
  `post_date` datetime DEFAULT NULL,
  `section` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `poster` int(11) DEFAULT NULL,
  `poster_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `t_post` WRITE;
/*!40000 ALTER TABLE `t_post` DISABLE KEYS */;

INSERT INTO `t_post` (`id`, `message`, `file`, `filename`, `post_date`, `section`, `section_id`, `poster`, `poster_id`)
VALUES
	(1,'test classpage post+upload','puppies.jpg','puppies.jpg','2016-04-16 18:12:48',1,1,2,2),
	(2,'another test...','01-Policies.pdf','01-Policies.pdf','2016-04-16 18:19:30',2,2,2,2),
	(3,'hi students!',NULL,NULL,'2016-04-16 18:28:07',1,1,2,2),
	(4,'test post',NULL,NULL,'2016-04-16 18:29:43',2,2,2,2),
	(5,'another test post..',NULL,NULL,'2016-04-16 18:33:10',2,2,2,2),
	(6,'huhu test pleawe',NULL,NULL,'2016-04-16 18:39:02',1,1,2,2),
	(7,'test postsdfsdf',NULL,NULL,'2016-04-23 17:59:28',1,1,2,2),
	(8,'hihih',NULL,NULL,'2016-04-23 17:59:45',1,1,2,2),
	(9,'awwwawww','exer3.docx','exer3.docx','2016-04-23 18:00:26',1,1,2,2),
	(10,'asfddfd','exer10-confmatrix.csv','exer10-confmatrix.csv','2016-04-23 19:22:13',1,1,2,2),
	(12,'rsetesr','TJR- webpage.docx','Sat Apr 23 2016 20:29:56 GMT+0800 (PHT)TJR- webpage.docx','2016-04-23 20:29:56',1,1,2,2),
	(18,'asdasd','exer3.docx','Thu Apr 28 2016 18:55:50 GMT+0800 (PHT)exer3.docx','2016-04-28 18:55:50',1,1,2,2),
	(19,'test','exer3.docx','Thu Apr 28 2016 19:02:21 GMT+0800 (PHT) - exer3.docx','2016-04-28 19:02:21',1,1,2,2);

/*!40000 ALTER TABLE `t_post` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_post_response
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_post_response`;

CREATE TABLE `t_post_response` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `message` varchar(60) DEFAULT NULL,
  `post_date` datetime DEFAULT NULL,
  `commenter` varchar(100) DEFAULT NULL,
  `commenter_id` int(11) DEFAULT NULL,
  `post_id` int(11) DEFAULT NULL,
  `post` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `t_post_response` WRITE;
/*!40000 ALTER TABLE `t_post_response` DISABLE KEYS */;

INSERT INTO `t_post_response` (`id`, `message`, `post_date`, `commenter`, `commenter_id`, `post_id`, `post`)
VALUES
	(1,'hi :)','2016-04-25 00:18:57','Terri Ayala',2,12,12),
	(2,'test','2016-04-25 00:55:09','Terri Ayala',2,12,12),
	(3,'wew','2016-04-25 00:55:19','Terri Ayala',2,10,10),
	(4,'hHaaa','2016-04-25 00:55:24','Terri Ayala',2,10,10);

/*!40000 ALTER TABLE `t_post_response` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_section
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_section`;

CREATE TABLE `t_section` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `course_number` varchar(30) DEFAULT NULL,
  `course_title` varchar(100) DEFAULT NULL,
  `units` varchar(10) DEFAULT NULL,
  `section_type` varchar(30) DEFAULT NULL,
  `section_name` varchar(15) DEFAULT NULL,
  `section_schedule` varchar(60) DEFAULT NULL,
  `semester` varchar(30) DEFAULT NULL,
  `slots_limit` int(11) DEFAULT NULL,
  `available_slots` int(11) DEFAULT NULL,
  `teacher` int(11) DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `t_section` WRITE;
/*!40000 ALTER TABLE `t_section` DISABLE KEYS */;

INSERT INTO `t_section` (`id`, `course_number`, `course_title`, `units`, `section_type`, `section_name`, `section_schedule`, `semester`, `slots_limit`, `available_slots`, `teacher`, `teacher_id`)
VALUES
	(1,'CMSC 11','Introduction to Computer Science','3.0','Lecture','UV','WF 7-8AM','1st Sem 15-16',100,NULL,2,2),
	(2,'CMSC 11','Introduction to Computer Science','3.0','Laboratory','UV-1L','TTH 10-1PM','1st Sem 15-16',30,NULL,2,2),
	(3,'CMSC 11','Introduction to Computer Science','3.0','Laboratory','UV-2L','TTH 10-1PM','1st Sem 15-16',30,NULL,2,2),
	(6,'CMSC 11','Introduction to Computer Science','3.0','Laboratory','UV-3L','TTH 1-4PM','1st Sem 15-16',30,NULL,2,2);

/*!40000 ALTER TABLE `t_section` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_student_section
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_student_section`;

CREATE TABLE `t_student_section` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `student_id` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table t_survey
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_survey`;

CREATE TABLE `t_survey` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `question` varchar(300) DEFAULT NULL,
  `is_single_answer` tinyint(1) DEFAULT NULL,
  `post_date` datetime DEFAULT NULL,
  `post_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table t_survey_answer
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_survey_answer`;

CREATE TABLE `t_survey_answer` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `answer` varchar(60) DEFAULT NULL,
  `survey_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table t_survey_response
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_survey_response`;

CREATE TABLE `t_survey_response` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `answer` varchar(120) DEFAULT NULL,
  `answer_id` int(11) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table t_teacher_section
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_teacher_section`;

CREATE TABLE `t_teacher_section` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `teacher_id` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table t_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_user`;

CREATE TABLE `t_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(60) DEFAULT NULL,
  `encrypted_password` varchar(100) DEFAULT NULL,
  `f_name` varchar(60) DEFAULT NULL,
  `m_name` varchar(60) DEFAULT NULL,
  `l_name` varchar(60) DEFAULT NULL,
  `sex` varchar(10) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  `admin_no` varchar(60) DEFAULT NULL,
  `student_no` varchar(15) DEFAULT NULL,
  `classification` varchar(60) DEFAULT NULL,
  `course` varchar(60) DEFAULT NULL,
  `college` varchar(60) DEFAULT NULL,
  `employee_no` varchar(15) DEFAULT NULL,
  `rank` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `idx_student_no` (`student_no`),
  UNIQUE KEY `idx_employee_no` (`employee_no`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `t_user` WRITE;
/*!40000 ALTER TABLE `t_user` DISABLE KEYS */;

INSERT INTO `t_user` (`id`, `username`, `encrypted_password`, `f_name`, `m_name`, `l_name`, `sex`, `birthday`, `role`, `admin_no`, `student_no`, `classification`, `course`, `college`, `employee_no`, `rank`)
VALUES
	(1,'student1','1234','Juan','Marquez','Cruz','Male','1998-02-02','Student',NULL,'2010-99999','Senior','BS Computer Science','College of Arts and Sciences',NULL,NULL),
	(2,'teacher1','1234','Terri','Johnson','Ayala','Female','1990-07-23','Teacher',NULL,NULL,NULL,NULL,NULL,'11111199919','Asst. Prof.'),
	(3,'teacher2','1234','Aimee','Nacorda','Velasquez','Female','1991-03-19','Teacher',NULL,NULL,NULL,NULL,NULL,'12131001121','Instructor 3'),
	(4,'student2','1234','Andrew','Punay','Bulaon','Male','1997-03-01','Student',NULL,'2010-91829','Freshman','BS Computer Science','College of Arts and Sciences',NULL,NULL),
	(5,'student3','1234','Marjorie','Jean','Kvetko','Female','1997-09-03','Student',NULL,'2010-32142','Sophomore','BS Computer Science','College of Arts and Sciences',NULL,NULL);

/*!40000 ALTER TABLE `t_user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_user_section
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_user_section`;

CREATE TABLE `t_user_section` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_section` (`user_id`,`section_id`,`role`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `t_user_section` WRITE;
/*!40000 ALTER TABLE `t_user_section` DISABLE KEYS */;

INSERT INTO `t_user_section` (`id`, `user_id`, `role`, `section_id`)
VALUES
	(1,1,'Student',1),
	(4,1,'Student',2),
	(2,2,'Teacher',1),
	(7,2,'Teacher',2),
	(5,2,'Teacher',3),
	(16,2,'Teacher',6),
	(3,4,'Student',1),
	(6,4,'Student',3);

/*!40000 ALTER TABLE `t_user_section` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
