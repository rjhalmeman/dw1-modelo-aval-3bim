-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: avap
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `avaliacao`
--

DROP TABLE IF EXISTS `avaliacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliacao` (
  `id_avaliacao` int NOT NULL AUTO_INCREMENT,
  `descricao_avaliacao` varchar(45) DEFAULT NULL,
  `data_avaliacao` datetime NOT NULL,
  `professor_pessoa_id_pessoa` int NOT NULL,
  `porcentagem_tolerancia_avaliacao` double NOT NULL,
  PRIMARY KEY (`id_avaliacao`),
  KEY `fk_avaliacao_professor1_idx` (`professor_pessoa_id_pessoa`),
  CONSTRAINT `fk_avaliacao_professor1` FOREIGN KEY (`professor_pessoa_id_pessoa`) REFERENCES `professor` (`pessoa_id_pessoa`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacao`
--

LOCK TABLES `avaliacao` WRITE;
/*!40000 ALTER TABLE `avaliacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `avaliacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avaliacao_has_avaliadores`
--

DROP TABLE IF EXISTS `avaliacao_has_avaliadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliacao_has_avaliadores` (
  `avaliacao_id_avaliacao` int NOT NULL,
  `avaliador_pessoa_id_pessoa` int NOT NULL,
  `avaliado_pessoa_id_pessoa` int NOT NULL,
  `nota_avaliacao_has_avaliadores` double NOT NULL,
  `hora_avaliacao_has_avaliadores` time NOT NULL,
  `jaFoiAvaliado_avaliacao_has_avaliadores` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`avaliacao_id_avaliacao`,`avaliador_pessoa_id_pessoa`,`avaliado_pessoa_id_pessoa`),
  KEY `fk_avaliacao_has_avaliadores_avaliacao_idx` (`avaliacao_id_avaliacao`),
  KEY `fk_avaliacao_has_avaliadores_avaliador1_idx` (`avaliador_pessoa_id_pessoa`),
  KEY `fk_avaliacao_has_avaliadores_avaliado1_idx` (`avaliado_pessoa_id_pessoa`),
  CONSTRAINT `fk_avaliacao_has_avaliadores_avaliacao` FOREIGN KEY (`avaliacao_id_avaliacao`) REFERENCES `avaliacao` (`id_avaliacao`),
  CONSTRAINT `fk_avaliacao_has_avaliadores_avaliado1` FOREIGN KEY (`avaliado_pessoa_id_pessoa`) REFERENCES `avaliado` (`pessoa_id_pessoa`),
  CONSTRAINT `fk_avaliacao_has_avaliadores_avaliador1` FOREIGN KEY (`avaliador_pessoa_id_pessoa`) REFERENCES `avaliador` (`pessoa_id_pessoa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacao_has_avaliadores`
--

LOCK TABLES `avaliacao_has_avaliadores` WRITE;
/*!40000 ALTER TABLE `avaliacao_has_avaliadores` DISABLE KEYS */;
/*!40000 ALTER TABLE `avaliacao_has_avaliadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avaliacao_has_questao`
--

DROP TABLE IF EXISTS `avaliacao_has_questao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliacao_has_questao` (
  `avaliacao_id_avaliacao` int NOT NULL,
  `questao_id_questao` int NOT NULL,
  `nota_avaliacao_has_questao` int NOT NULL DEFAULT '-1',
  PRIMARY KEY (`avaliacao_id_avaliacao`,`questao_id_questao`),
  KEY `fk_avaliacao_has_questao_questao1_idx` (`questao_id_questao`),
  KEY `fk_avaliacao_has_questao_avaliacao1_idx` (`avaliacao_id_avaliacao`),
  CONSTRAINT `fk_avaliacao_has_questao_avaliacao1` FOREIGN KEY (`avaliacao_id_avaliacao`) REFERENCES `avaliacao` (`id_avaliacao`),
  CONSTRAINT `fk_avaliacao_has_questao_questao1` FOREIGN KEY (`questao_id_questao`) REFERENCES `questao` (`id_questao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacao_has_questao`
--

LOCK TABLES `avaliacao_has_questao` WRITE;
/*!40000 ALTER TABLE `avaliacao_has_questao` DISABLE KEYS */;
/*!40000 ALTER TABLE `avaliacao_has_questao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avaliado`
--

DROP TABLE IF EXISTS `avaliado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliado` (
  `pessoa_id_pessoa` int NOT NULL,
  `tema_apresentado_avaliado` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`pessoa_id_pessoa`),
  CONSTRAINT `fk_avaliado_pessoa1` FOREIGN KEY (`pessoa_id_pessoa`) REFERENCES `pessoa` (`id_pessoa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliado`
--

LOCK TABLES `avaliado` WRITE;
/*!40000 ALTER TABLE `avaliado` DISABLE KEYS */;
/*!40000 ALTER TABLE `avaliado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avaliador`
--

DROP TABLE IF EXISTS `avaliador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliador` (
  `pessoa_id_pessoa` int NOT NULL,
  PRIMARY KEY (`pessoa_id_pessoa`),
  CONSTRAINT `fk_avaliador_pessoa1` FOREIGN KEY (`pessoa_id_pessoa`) REFERENCES `pessoa` (`id_pessoa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliador`
--

LOCK TABLES `avaliador` WRITE;
/*!40000 ALTER TABLE `avaliador` DISABLE KEYS */;
/*!40000 ALTER TABLE `avaliador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pessoa`
--

DROP TABLE IF EXISTS `pessoa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pessoa` (
  `id_pessoa` int NOT NULL AUTO_INCREMENT,
  `nome_pessoa` varchar(50) NOT NULL,
  `email_pessoa` varchar(70) NOT NULL,
  `senha_pessoa` varchar(32) NOT NULL,
  `primeiro_acesso_pessoa` tinyint(1) NOT NULL DEFAULT '1',
  `data_nascimento` datetime DEFAULT NULL,
  PRIMARY KEY (`id_pessoa`),
  UNIQUE KEY `email_pessoa_UNIQUE` (`email_pessoa`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pessoa`
--

LOCK TABLES `pessoa` WRITE;
/*!40000 ALTER TABLE `pessoa` DISABLE KEYS */;
INSERT INTO `pessoa` VALUES (1,'Berola Silva','berola@gmail.com','abc123',1,'2000-01-02 00:00:00'),(2,'maria','maria@gmail.com','abc123',1,'2000-01-01 00:00:00'),(75,'aaaa','aaaa@email.com','aaa123',1,'2025-07-14 00:00:00'),(77,'cccc','cccc@gmail.com','ccc123',0,'2025-07-02 00:00:00'),(78,'bbbb','bbbb@email.com','bbb123',1,'2025-07-22 00:00:00'),(79,'Timocreia','timocreia@email.com','tim123',1,'2018-02-28 00:00:00');
/*!40000 ALTER TABLE `pessoa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professor`
--

DROP TABLE IF EXISTS `professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professor` (
  `pessoa_id_pessoa` int NOT NULL,
  `mnemonico_professor` varchar(45) NOT NULL,
  `departamento_professor` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`pessoa_id_pessoa`),
  CONSTRAINT `fk_professor_pessoa1` FOREIGN KEY (`pessoa_id_pessoa`) REFERENCES `pessoa` (`id_pessoa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professor`
--

LOCK TABLES `professor` WRITE;
/*!40000 ALTER TABLE `professor` DISABLE KEYS */;
INSERT INTO `professor` VALUES (1,'berola','DACOM'),(2,'mary','ascMaria');
/*!40000 ALTER TABLE `professor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questao`
--

DROP TABLE IF EXISTS `questao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questao` (
  `id_questao` int NOT NULL,
  `texto_questao` varchar(45) NOT NULL,
  `nota_maxima_questao` int NOT NULL,
  `texto_complementar_questao` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_questao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questao`
--

LOCK TABLES `questao` WRITE;
/*!40000 ALTER TABLE `questao` DISABLE KEYS */;
/*!40000 ALTER TABLE `questao` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-31  6:48:53
