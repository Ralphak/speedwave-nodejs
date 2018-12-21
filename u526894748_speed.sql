-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 21/12/2018 às 11:54
-- Versão do servidor: 10.2.17-MariaDB
-- Versão do PHP: 7.2.10

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
  `fk_embarcacao` int(11) NOT NULL,
  `fk_empresa` int(11) NOT NULL,
  `data_aluguel` datetime DEFAULT NULL,
  `valor` double DEFAULT NULL,
  `status` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Ativo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `alugalancha_empresa`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `alugalancha_empresa` (
`id` int(11)
,`fk_embarcacao` int(11)
,`nome_embarcacao` varchar(255)
,`fk_empresa` int(11)
,`fk_usuario` int(11)
,`comprador` varchar(255)
,`data_aluguel` datetime
,`valor` double
,`status` varchar(10)
);

-- --------------------------------------------------------

--
-- Estrutura para tabela `aluguelbarco`
--

CREATE TABLE `aluguelbarco` (
  `id` int(11) NOT NULL,
  `fk_embarcacao` int(11) NOT NULL,
  `fk_empresa` int(11) NOT NULL,
  `data_aluguel` datetime DEFAULT NULL,
  `valor` double DEFAULT NULL,
  `status` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Ativo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `aluguelbarco_empresa`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `aluguelbarco_empresa` (
`id` int(11)
,`fk_empresa` int(11)
,`fk_embarcacao` int(11)
,`nome_embarcacao` varchar(255)
,`num_passageiros` bigint(21)
,`max_passageiros` int(5)
,`data_aluguel` datetime
,`valor` double
,`status` varchar(10)
);

-- --------------------------------------------------------

--
-- Estrutura para tabela `bancoempbarco`
--

CREATE TABLE `bancoempbarco` (
  `id` int(11) NOT NULL,
  `fk_empresa` int(11) DEFAULT NULL,
  `cpf` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `banco` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `agencia` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `conta` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `titular` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `embarcacao`
--

CREATE TABLE `embarcacao` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `categoria` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `numero` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `data` date NOT NULL,
  `validade` date NOT NULL,
  `max_passageiros` int(5) NOT NULL,
  `max_tripulantes` int(5) NOT NULL,
  `atividade` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `area_nav` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `cidade` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `fk_empbarco` int(11) NOT NULL,
  `valor` double DEFAULT NULL,
  `documento1` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `documento2` longtext COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `empresabarco`
--

CREATE TABLE `empresabarco` (
  `id` int(11) NOT NULL,
  `razao` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cnpj` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `info` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `telefone` bigint(20) DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `senha` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `documento1` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `documento2` longtext COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `endemp`
--

CREATE TABLE `endemp` (
  `id` int(11) NOT NULL,
  `fk_empresa` int(11) DEFAULT NULL,
  `rua` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cep` int(8) DEFAULT NULL,
  `bairro` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cidade` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pais` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `numero` int(5) DEFAULT NULL,
  `complemento` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `endereco`
--

CREATE TABLE `endereco` (
  `id` int(11) NOT NULL,
  `fk_usuario` int(11) NOT NULL,
  `rua` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cep` int(8) DEFAULT NULL,
  `bairro` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cidade` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pais` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `numero` int(5) DEFAULT NULL,
  `complemento` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `fotoembar`
--

CREATE TABLE `fotoembar` (
  `id` int(11) NOT NULL,
  `fk_embar` int(11) NOT NULL,
  `proa` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `popa` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `traves` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `interior1` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `interior2` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `interior3` longtext COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `pagamentos`
--

CREATE TABLE `pagamentos` (
  `id` int(11) NOT NULL,
  `fk_empresa` int(11) NOT NULL,
  `fk_usuario` int(11) NOT NULL,
  `valor` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `passageiros`
--

CREATE TABLE `passageiros` (
  `id` int(11) NOT NULL,
  `fk_aluguelbarco` int(11) NOT NULL,
  `fk_usuario` int(11) DEFAULT NULL,
  `nome` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `cpf` varchar(25) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Gatilhos `passageiros`
--
DELIMITER $$
CREATE TRIGGER `trigger_lotado` AFTER INSERT ON `passageiros` FOR EACH ROW UPDATE aluguelbarco JOIN aluguelbarco_empresa on aluguelbarco.id=aluguelbarco_empresa.id SET aluguelbarco.status='Lotado' WHERE (aluguelbarco.status='Ativo') AND (aluguelbarco_empresa.num_passageiros >= aluguelbarco_empresa.max_passageiros)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `passlancha`
--

CREATE TABLE `passlancha` (
  `id` int(11) NOT NULL,
  `fk_alugalancha` int(11) NOT NULL,
  `fk_usuario` int(11) DEFAULT NULL,
  `nome` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `cpf` varchar(25) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `socio`
--

CREATE TABLE `socio` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cpf` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `data_nasc` date DEFAULT NULL,
  `rua` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bairro` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cidade` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pais` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cep` int(8) DEFAULT NULL,
  `senha` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `fk_empresa` int(11) DEFAULT NULL,
  `altoAcesso` tinyint(1) DEFAULT NULL,
  `numero` int(5) DEFAULT NULL,
  `complemento` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `socio_login`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `socio_login` (
`id` int(11)
,`id_socio` int(11)
,`cpf` varchar(20)
,`senha` varchar(255)
,`altoAcesso` tinyint(1)
,`razao` varchar(255)
,`nome` varchar(255)
);

-- --------------------------------------------------------

--
-- Estrutura para tabela `triplancha`
--

CREATE TABLE `triplancha` (
  `id` int(11) NOT NULL,
  `fk_alugalancha` int(11) DEFAULT NULL,
  `nome` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cpf` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tripulantes`
--

CREATE TABLE `tripulantes` (
  `id` int(11) NOT NULL,
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
  `data_nasc` date DEFAULT NULL,
  `cpf` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `telefone` bigint(20) DEFAULT NULL,
  `telefone2` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para view `alugalancha_empresa`
--
DROP TABLE IF EXISTS `alugalancha_empresa`;

CREATE ALGORITHM=UNDEFINED DEFINER=`u526894748_pic`@`127.0.0.1` SQL SECURITY DEFINER VIEW `alugalancha_empresa`  AS  select `alugalancha`.`id` AS `id`,`alugalancha`.`fk_embarcacao` AS `fk_embarcacao`,`embarcacao`.`nome` AS `nome_embarcacao`,`alugalancha`.`fk_empresa` AS `fk_empresa`,`alugalancha`.`fk_usuario` AS `fk_usuario`,`usuario`.`nome` AS `comprador`,`alugalancha`.`data_aluguel` AS `data_aluguel`,`alugalancha`.`valor` AS `valor`,`alugalancha`.`status` AS `status` from ((`alugalancha` join `embarcacao` on(`alugalancha`.`fk_embarcacao` = `embarcacao`.`id`)) left join `usuario` on(`alugalancha`.`fk_usuario` = `usuario`.`id`)) ;

-- --------------------------------------------------------

--
-- Estrutura para view `aluguelbarco_empresa`
--
DROP TABLE IF EXISTS `aluguelbarco_empresa`;

CREATE ALGORITHM=UNDEFINED DEFINER=`u526894748_pic`@`127.0.0.1` SQL SECURITY DEFINER VIEW `aluguelbarco_empresa`  AS  select `aluguelbarco`.`id` AS `id`,`aluguelbarco`.`fk_empresa` AS `fk_empresa`,`aluguelbarco`.`fk_embarcacao` AS `fk_embarcacao`,`embarcacao`.`nome` AS `nome_embarcacao`,count(`passageiros`.`fk_aluguelbarco`) AS `num_passageiros`,`embarcacao`.`max_passageiros` AS `max_passageiros`,`aluguelbarco`.`data_aluguel` AS `data_aluguel`,`aluguelbarco`.`valor` AS `valor`,`aluguelbarco`.`status` AS `status` from ((`aluguelbarco` join `embarcacao` on(`aluguelbarco`.`fk_embarcacao` = `embarcacao`.`id`)) left join `passageiros` on(`aluguelbarco`.`id` = `passageiros`.`fk_aluguelbarco`)) group by `aluguelbarco`.`id` ;

-- --------------------------------------------------------

--
-- Estrutura para view `socio_login`
--
DROP TABLE IF EXISTS `socio_login`;

CREATE ALGORITHM=UNDEFINED DEFINER=`u526894748_pic`@`127.0.0.1` SQL SECURITY DEFINER VIEW `socio_login`  AS  select `empresabarco`.`id` AS `id`,`socio`.`id` AS `id_socio`,`socio`.`cpf` AS `cpf`,`socio`.`senha` AS `senha`,`socio`.`altoAcesso` AS `altoAcesso`,`empresabarco`.`razao` AS `razao`,`socio`.`nome` AS `nome` from (`socio` join `empresabarco`) where `socio`.`fk_empresa` = `empresabarco`.`id` ;

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
  ADD KEY `fk_vendemp` (`fk_empresa`);

--
-- Índices de tabela `aluguelbarco`
--
ALTER TABLE `aluguelbarco`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_embarcacao` (`fk_embarcacao`),
  ADD KEY `fk_vendemp` (`fk_empresa`);

--
-- Índices de tabela `bancoempbarco`
--
ALTER TABLE `bancoempbarco`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_empbarco` (`fk_empresa`);

--
-- Índices de tabela `embarcacao`
--
ALTER TABLE `embarcacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_barco_emp` (`fk_empbarco`);

--
-- Índices de tabela `empresabarco`
--
ALTER TABLE `empresabarco`
  ADD PRIMARY KEY (`id`);

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
-- Índices de tabela `fotoembar`
--
ALTER TABLE `fotoembar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_embar` (`fk_embar`);

--
-- Índices de tabela `pagamentos`
--
ALTER TABLE `pagamentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pag_empresa` (`fk_empresa`),
  ADD KEY `fk_pag_usuario` (`fk_usuario`);

--
-- Índices de tabela `passageiros`
--
ALTER TABLE `passageiros`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pass_aluguelbarco` (`fk_aluguelbarco`);

--
-- Índices de tabela `passlancha`
--
ALTER TABLE `passlancha`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pass_alugalancha` (`fk_alugalancha`);

--
-- Índices de tabela `socio`
--
ALTER TABLE `socio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_empresa` (`fk_empresa`);

--
-- Índices de tabela `triplancha`
--
ALTER TABLE `triplancha`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tripu_alugalancha` (`fk_alugalancha`);

--
-- Índices de tabela `tripulantes`
--
ALTER TABLE `tripulantes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tripu_aluguelbarco` (`fk_aluguelbarco`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `bancoempbarco`
--
ALTER TABLE `bancoempbarco`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `embarcacao`
--
ALTER TABLE `embarcacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `empresabarco`
--
ALTER TABLE `empresabarco`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `endemp`
--
ALTER TABLE `endemp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `endereco`
--
ALTER TABLE `endereco`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `fotoembar`
--
ALTER TABLE `fotoembar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `pagamentos`
--
ALTER TABLE `pagamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `passageiros`
--
ALTER TABLE `passageiros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `passlancha`
--
ALTER TABLE `passlancha`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `socio`
--
ALTER TABLE `socio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `triplancha`
--
ALTER TABLE `triplancha`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tripulantes`
--
ALTER TABLE `tripulantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para dumps de tabelas
--

--
-- Restrições para tabelas `alugalancha`
--
ALTER TABLE `alugalancha`
  ADD CONSTRAINT `fk_lancha_embarcacao` FOREIGN KEY (`fk_embarcacao`) REFERENCES `embarcacao` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_lancha_empresa` FOREIGN KEY (`fk_empresa`) REFERENCES `empresabarco` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_lancha_usuario` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `aluguelbarco`
--
ALTER TABLE `aluguelbarco`
  ADD CONSTRAINT `fk_aluga_embarcacao` FOREIGN KEY (`fk_embarcacao`) REFERENCES `embarcacao` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_aluga_empresa` FOREIGN KEY (`fk_empresa`) REFERENCES `empresabarco` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `bancoempbarco`
--
ALTER TABLE `bancoempbarco`
  ADD CONSTRAINT `fk_bancoempbarco` FOREIGN KEY (`fk_empresa`) REFERENCES `empresabarco` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `embarcacao`
--
ALTER TABLE `embarcacao`
  ADD CONSTRAINT `fk_barco_emp` FOREIGN KEY (`fk_empbarco`) REFERENCES `empresabarco` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `endemp`
--
ALTER TABLE `endemp`
  ADD CONSTRAINT `fk_emp_end` FOREIGN KEY (`fk_empresa`) REFERENCES `empresabarco` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `endereco`
--
ALTER TABLE `endereco`
  ADD CONSTRAINT `fk_usu_end` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `fotoembar`
--
ALTER TABLE `fotoembar`
  ADD CONSTRAINT `fk_foto_embar` FOREIGN KEY (`fk_embar`) REFERENCES `embarcacao` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `pagamentos`
--
ALTER TABLE `pagamentos`
  ADD CONSTRAINT `fk_pag_empresa` FOREIGN KEY (`fk_empresa`) REFERENCES `empresabarco` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pag_usuario` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `passageiros`
--
ALTER TABLE `passageiros`
  ADD CONSTRAINT `fk_pass_aluguelbarco` FOREIGN KEY (`fk_aluguelbarco`) REFERENCES `aluguelbarco` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `passlancha`
--
ALTER TABLE `passlancha`
  ADD CONSTRAINT `fk_pass_alugalancha` FOREIGN KEY (`fk_alugalancha`) REFERENCES `alugalancha` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `socio`
--
ALTER TABLE `socio`
  ADD CONSTRAINT `fk_socio_emp` FOREIGN KEY (`fk_empresa`) REFERENCES `empresabarco` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `triplancha`
--
ALTER TABLE `triplancha`
  ADD CONSTRAINT `fk_tripu_alugalancha` FOREIGN KEY (`fk_alugalancha`) REFERENCES `alugalancha` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `tripulantes`
--
ALTER TABLE `tripulantes`
  ADD CONSTRAINT `fk_tripu_aluguelbarco` FOREIGN KEY (`fk_aluguelbarco`) REFERENCES `aluguelbarco` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

DELIMITER $$
--
-- Eventos
--
CREATE DEFINER=`u526894748_pic`@`127.0.0.1` EVENT `event_terminar_servicos` ON SCHEDULE EVERY 1 DAY STARTS '2018-12-21 05:24:02' ON COMPLETION PRESERVE ENABLE DO BEGIN
UPDATE alugalancha SET status='Terminado' where (status NOT LIKE 'Terminado') AND (data_aluguel < CURRENT_DATE);
UPDATE aluguelbarco SET status='Terminado' where (status NOT LIKE 'Terminado') AND (data_aluguel < CURRENT_DATE);
END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
