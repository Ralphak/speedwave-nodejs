drop database if exists teste_speed;
create database teste_speed;
use teste_speed;

-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 11/11/2018 às 13:49
-- Versão do servidor: 10.2.17-MariaDB
-- Versão do PHP: 7.1.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `u526894748_speed`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `alugalancha`
--

CREATE TABLE `alugalancha` (
  `id` int(11) NOT NULL,
  `fk_usuario` int(11) DEFAULT NULL,
  `fk_embarcacao` int(11) DEFAULT NULL,
  `fk_vendemp` int(11) DEFAULT NULL,
  `data_aluguel` date DEFAULT NULL,
  `valor` double DEFAULT NULL,
  `status` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `aluguelbarco`
--

CREATE TABLE `aluguelbarco` (
  `id_nota` int(11) NOT NULL,
  `fk_usuario` int(11) DEFAULT NULL,
  `fk_embarcacao` int(11) DEFAULT NULL,
  `fk_vendemp` int(11) DEFAULT NULL,
  `data_aluguel` int(11) DEFAULT NULL,
  `valor` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `bancoempbarco`
--

CREATE TABLE `bancoempbarco` (
  `id_bancoempbarco` int(11) NOT NULL,
  `fk_empbarco` int(11) DEFAULT NULL,
  `cpf` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `banco` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `agencia` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `conta` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `bancovendemp`
--

CREATE TABLE `bancovendemp` (
  `id_bancovendemp` int(11) NOT NULL,
  `fk_vendemp` int(11) DEFAULT NULL,
  `cpf` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `banco` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `agencia` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `conta` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `embarcacao`
--

CREATE TABLE `embarcacao` (
  `id_embarcacao` int(11) NOT NULL,
  `nome` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `categoria` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `numero` int(50) NOT NULL,
  `data` date NOT NULL,
  `validade` date NOT NULL,
  `capacidade` int(5) NOT NULL,
  `qtd_tripulantes` int(10) NOT NULL,
  `atividade` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `area_nav` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `cidade` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `fk_empbarco` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `empresabarco`
--

CREATE TABLE `empresabarco` (
  `id_empresa` int(11) NOT NULL,
  `razao` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cnpj` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `info` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `titular` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `telefone` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `senha` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `endemp`
--

CREATE TABLE `endemp` (
  `id` int(11) NOT NULL,
  `fk_empresa` int(11) DEFAULT NULL,
  `rua` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `numero` int(10) DEFAULT NULL,
  `cep` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bairro` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cidade` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pais` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `endereco`
--

CREATE TABLE `endereco` (
  `id` int(11) NOT NULL,
  `fk_usuario` int(11) NOT NULL,
  `rua` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `numero` int(10) DEFAULT NULL,
  `cep` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bairro` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cidade` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `estado` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pais` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `endvendemp`
--

CREATE TABLE `endvendemp` (
  `id_end` int(11) NOT NULL,
  `fk_vendemp` int(11) NOT NULL,
  `rua` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `numero` int(10) DEFAULT NULL,
  `bairro` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cidade` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `estado` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pais` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cep` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `fotoembar`
--

CREATE TABLE `fotoembar` (
  `id_fotoembar` int(11) NOT NULL,
  `fk_embar` int(11) NOT NULL,
  `proa` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `popa` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `través` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `interior1` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `interior2` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `interior3` longtext COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `socio`
--

CREATE TABLE `socio` (
  `id_socio` int(11) NOT NULL,
  `nome` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cpf` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `data_nasc` date DEFAULT NULL,
  `rua` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bairro` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cidade` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pais` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cep` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `senha` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `fk_empresa` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `sociovendemp`
--

CREATE TABLE `sociovendemp` (
  `id_socio` int(11) NOT NULL,
  `fk_vendemp` int(11) NOT NULL,
  `nome` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cpf` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `datanasc` date DEFAULT NULL,
  `rua` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bairro` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cidade` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pais` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `senha` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tripulantes`
--

CREATE TABLE `tripulantes` (
  `id_tripulante` int(11) NOT NULL,
  `fk_aluguelbarco` int(11) DEFAULT NULL,
  `nome` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cpf` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `login` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `senha` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `caminho` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `cpf` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `telefone` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `telefone2` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `vendemp`
--

CREATE TABLE `vendemp` (
  `id_vendemp` int(11) NOT NULL,
  `razao` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cnpj` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `info` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `titular` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `telefone` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `senha` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Índices de tabelas apagadas
--

--
-- Índices de tabela `alugalancha`
--
ALTER TABLE `alugalancha`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usuario` (`fk_usuario`),
  ADD KEY `fk_embarcacao` (`fk_embarcacao`),
  ADD KEY `fk_vendemp` (`fk_vendemp`);

--
-- Índices de tabela `aluguelbarco`
--
ALTER TABLE `aluguelbarco`
  ADD PRIMARY KEY (`id_nota`),
  ADD KEY `fk_usuario` (`fk_usuario`),
  ADD KEY `fk_embarcacao` (`fk_embarcacao`),
  ADD KEY `fk_vendemp` (`fk_vendemp`);

--
-- Índices de tabela `bancoempbarco`
--
ALTER TABLE `bancoempbarco`
  ADD PRIMARY KEY (`id_bancoempbarco`),
  ADD KEY `fk_empbarco` (`fk_empbarco`);

--
-- Índices de tabela `bancovendemp`
--
ALTER TABLE `bancovendemp`
  ADD PRIMARY KEY (`id_bancovendemp`),
  ADD KEY `fk_bancovendemp` (`fk_vendemp`);

--
-- Índices de tabela `embarcacao`
--
ALTER TABLE `embarcacao`
  ADD PRIMARY KEY (`id_embarcacao`),
  ADD KEY `fk_barco_emp` (`fk_empbarco`);

--
-- Índices de tabela `empresabarco`
--
ALTER TABLE `empresabarco`
  ADD PRIMARY KEY (`id_empresa`);

--
-- Índices de tabela `endemp`
--
ALTER TABLE `endemp`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_emp_end` (`fk_empresa`);

--
-- Índices de tabela `endereco`
--
ALTER TABLE `endereco`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usu_end` (`fk_usuario`);

--
-- Índices de tabela `endvendemp`
--
ALTER TABLE `endvendemp`
  ADD PRIMARY KEY (`id_end`),
  ADD KEY `fk_vendemp` (`fk_vendemp`);

--
-- Índices de tabela `fotoembar`
--
ALTER TABLE `fotoembar`
  ADD PRIMARY KEY (`id_fotoembar`),
  ADD KEY `fk_embar` (`fk_embar`);

--
-- Índices de tabela `socio`
--
ALTER TABLE `socio`
  ADD PRIMARY KEY (`id_socio`),
  ADD KEY `fk_empresa` (`fk_empresa`);

--
-- Índices de tabela `sociovendemp`
--
ALTER TABLE `sociovendemp`
  ADD PRIMARY KEY (`id_socio`),
  ADD KEY `fk_vendemp` (`fk_vendemp`);

--
-- Índices de tabela `tripulantes`
--
ALTER TABLE `tripulantes`
  ADD PRIMARY KEY (`id_tripulante`),
  ADD KEY `fk_tripu_aluguelbarco` (`fk_aluguelbarco`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `vendemp`
--
ALTER TABLE `vendemp`
  ADD PRIMARY KEY (`id_vendemp`);

--
-- AUTO_INCREMENT de tabelas apagadas
--

--
-- AUTO_INCREMENT de tabela `alugalancha`
--
ALTER TABLE `alugalancha`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `aluguelbarco`
--
ALTER TABLE `aluguelbarco`
  MODIFY `id_nota` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `bancoempbarco`
--
ALTER TABLE `bancoempbarco`
  MODIFY `id_bancoempbarco` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `bancovendemp`
--
ALTER TABLE `bancovendemp`
  MODIFY `id_bancovendemp` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `embarcacao`
--
ALTER TABLE `embarcacao`
  MODIFY `id_embarcacao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `empresabarco`
--
ALTER TABLE `empresabarco`
  MODIFY `id_empresa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `endemp`
--
ALTER TABLE `endemp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `endereco`
--
ALTER TABLE `endereco`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `endvendemp`
--
ALTER TABLE `endvendemp`
  MODIFY `id_end` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `fotoembar`
--
ALTER TABLE `fotoembar`
  MODIFY `id_fotoembar` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `socio`
--
ALTER TABLE `socio`
  MODIFY `id_socio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `sociovendemp`
--
ALTER TABLE `sociovendemp`
  MODIFY `id_socio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tripulantes`
--
ALTER TABLE `tripulantes`
  MODIFY `id_tripulante` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `vendemp`
--
ALTER TABLE `vendemp`
  MODIFY `id_vendemp` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para dumps de tabelas
--

--
-- Restrições para tabelas `alugalancha`
--
ALTER TABLE `alugalancha`
  ADD CONSTRAINT `fk_lancha_embarcacao` FOREIGN KEY (`fk_embarcacao`) REFERENCES `embarcacao` (`id_embarcacao`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_lancha_usuario` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_lancha_vendemp` FOREIGN KEY (`fk_vendemp`) REFERENCES `vendemp` (`id_vendemp`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `aluguelbarco`
--
ALTER TABLE `aluguelbarco`
  ADD CONSTRAINT `fk_aluga_embarcacao` FOREIGN KEY (`fk_embarcacao`) REFERENCES `embarcacao` (`id_embarcacao`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_aluga_usuario` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_aluga_vendemp` FOREIGN KEY (`fk_vendemp`) REFERENCES `vendemp` (`id_vendemp`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `bancoempbarco`
--
ALTER TABLE `bancoempbarco`
  ADD CONSTRAINT `fk_bancoempbarco` FOREIGN KEY (`fk_empbarco`) REFERENCES `empresabarco` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `bancovendemp`
--
ALTER TABLE `bancovendemp`
  ADD CONSTRAINT `fk_bancovendemp` FOREIGN KEY (`fk_vendemp`) REFERENCES `vendemp` (`id_vendemp`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `embarcacao`
--
ALTER TABLE `embarcacao`
  ADD CONSTRAINT `fk_barco_emp` FOREIGN KEY (`fk_empbarco`) REFERENCES `empresabarco` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `endemp`
--
ALTER TABLE `endemp`
  ADD CONSTRAINT `fk_emp_end` FOREIGN KEY (`fk_empresa`) REFERENCES `empresabarco` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `endereco`
--
ALTER TABLE `endereco`
  ADD CONSTRAINT `fk_usu_end` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `endvendemp`
--
ALTER TABLE `endvendemp`
  ADD CONSTRAINT `fk_endvendemp` FOREIGN KEY (`fk_vendemp`) REFERENCES `vendemp` (`id_vendemp`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `fotoembar`
--
ALTER TABLE `fotoembar`
  ADD CONSTRAINT `fk_foto_embar` FOREIGN KEY (`fk_embar`) REFERENCES `embarcacao` (`id_embarcacao`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `socio`
--
ALTER TABLE `socio`
  ADD CONSTRAINT `fk_socio_emp` FOREIGN KEY (`fk_empresa`) REFERENCES `empresabarco` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `sociovendemp`
--
ALTER TABLE `sociovendemp`
  ADD CONSTRAINT `fk_socio_vendemp` FOREIGN KEY (`fk_vendemp`) REFERENCES `vendemp` (`id_vendemp`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `tripulantes`
--
ALTER TABLE `tripulantes`
  ADD CONSTRAINT `fk_tripu_aluguelbarco` FOREIGN KEY (`fk_aluguelbarco`) REFERENCES `aluguelbarco` (`id_nota`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
