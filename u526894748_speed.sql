-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 25/02/2019 às 19:39
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
  `status` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Ativo',
  `fk_pagamento` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `alugalancha_cliente`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `alugalancha_cliente` (
`id` int(11)
,`fk_usuario` int(11)
,`fk_embarcacao` int(11)
,`nome_embarcacao` varchar(255)
,`cidade` varchar(50)
,`fk_empresa` int(11)
,`razao` varchar(255)
,`valor` double
,`porcentagem` double
,`data_aluguel` datetime
);

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
  `status` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Ativo',
  `lim_passageiros` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `aluguelbarco_cliente`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `aluguelbarco_cliente` (
`id` int(11)
,`fk_usuario` int(11)
,`fk_embarcacao` int(11)
,`nome_embarcacao` varchar(255)
,`cidade` varchar(50)
,`fk_empresa` int(11)
,`razao` varchar(255)
,`num_pessoas` bigint(21)
,`fk_pagamento` int(11)
,`valor` double
,`porcentagem` double
,`data_aluguel` datetime
);

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
,`lim_passageiros` int(5)
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
  `autorizado` tinyint(1) NOT NULL DEFAULT 0
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
  `autorizado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `empresadetalhes`
--

CREATE TABLE `empresadetalhes` (
  `id` int(11) NOT NULL,
  `fk_empresa` int(11) DEFAULT NULL,
  `idoma` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `indica` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sobre` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `endemp`
--

CREATE TABLE `endemp` (
  `fk_empresa` int(11) NOT NULL,
  `rua` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `numero` int(5) DEFAULT NULL,
  `complemento` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cep` int(8) DEFAULT NULL,
  `bairro` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cidade` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `endereco`
--

CREATE TABLE `endereco` (
  `fk_usuario` int(11) NOT NULL,
  `rua` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `numero` int(5) DEFAULT NULL,
  `complemento` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cep` int(8) DEFAULT NULL,
  `bairro` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cidade` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `extrato`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `extrato` (
`id` int(11)
,`fk_empresa` int(11)
,`fk_usuario` int(11)
,`valor` double
,`data_pagamento` datetime
,`nome` varchar(255)
,`cliente` varchar(255)
);

-- --------------------------------------------------------

--
-- Estrutura para tabela `fotoembar`
--

CREATE TABLE `fotoembar` (
  `fk_embar` int(11) NOT NULL,
  `proa` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `popa` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `traves` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `interior1` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `interior2` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `interior3` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `pagamentos`
--

CREATE TABLE `pagamentos` (
  `id` int(11) NOT NULL,
  `fk_empresa` int(11) NOT NULL,
  `fk_usuario` int(11) NOT NULL,
  `valor` double NOT NULL,
  `data_pagamento` datetime DEFAULT NULL,
  `porcentagem` double DEFAULT NULL
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
  `fk_pagamento` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Gatilhos `passageiros`
--
DELIMITER $$
CREATE TRIGGER `trigger_lotado` AFTER INSERT ON `passageiros` FOR EACH ROW UPDATE aluguelbarco JOIN aluguelbarco_empresa on aluguelbarco.id=aluguelbarco_empresa.id SET aluguelbarco.status='Lotado' WHERE (aluguelbarco.status='Ativo') AND (aluguelbarco_empresa.num_passageiros >= aluguelbarco_empresa.lim_passageiros)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `socio`
--

CREATE TABLE `socio` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cpf` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `data_nasc` date DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `rua` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `numero` int(5) DEFAULT NULL,
  `complemento` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cep` int(8) DEFAULT NULL,
  `bairro` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cidade` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `senha` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `fk_empresa` int(11) DEFAULT NULL,
  `altoAcesso` tinyint(1) DEFAULT 0
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
-- Estrutura para view `alugalancha_cliente`
--
DROP TABLE IF EXISTS `alugalancha_cliente`;

CREATE ALGORITHM=UNDEFINED DEFINER=`u526894748_pic`@`127.0.0.1` SQL SECURITY DEFINER VIEW `alugalancha_cliente`  AS  select `alugalancha`.`id` AS `id`,`alugalancha`.`fk_usuario` AS `fk_usuario`,`alugalancha`.`fk_embarcacao` AS `fk_embarcacao`,`embarcacao`.`nome` AS `nome_embarcacao`,`embarcacao`.`cidade` AS `cidade`,`alugalancha`.`fk_empresa` AS `fk_empresa`,`empresabarco`.`razao` AS `razao`,`alugalancha`.`valor` AS `valor`,`pagamentos`.`porcentagem` AS `porcentagem`,`alugalancha`.`data_aluguel` AS `data_aluguel` from (((`alugalancha` join `embarcacao` on(`alugalancha`.`fk_embarcacao` = `embarcacao`.`id`)) join `empresabarco` on(`alugalancha`.`fk_empresa` = `empresabarco`.`id`)) join `pagamentos` on(`alugalancha`.`fk_pagamento` = `pagamentos`.`id`)) where `alugalancha`.`fk_usuario` is not null ;

-- --------------------------------------------------------

--
-- Estrutura para view `alugalancha_empresa`
--
DROP TABLE IF EXISTS `alugalancha_empresa`;

CREATE ALGORITHM=UNDEFINED DEFINER=`u526894748_pic`@`127.0.0.1` SQL SECURITY DEFINER VIEW `alugalancha_empresa`  AS  select `alugalancha`.`id` AS `id`,`alugalancha`.`fk_embarcacao` AS `fk_embarcacao`,`embarcacao`.`nome` AS `nome_embarcacao`,`alugalancha`.`fk_empresa` AS `fk_empresa`,`alugalancha`.`fk_usuario` AS `fk_usuario`,`usuario`.`nome` AS `comprador`,`alugalancha`.`data_aluguel` AS `data_aluguel`,`alugalancha`.`valor` AS `valor`,`alugalancha`.`status` AS `status` from ((`alugalancha` join `embarcacao` on(`alugalancha`.`fk_embarcacao` = `embarcacao`.`id`)) left join `usuario` on(`alugalancha`.`fk_usuario` = `usuario`.`id`)) ;

-- --------------------------------------------------------

--
-- Estrutura para view `aluguelbarco_cliente`
--
DROP TABLE IF EXISTS `aluguelbarco_cliente`;

CREATE ALGORITHM=UNDEFINED DEFINER=`u526894748_pic`@`127.0.0.1` SQL SECURITY DEFINER VIEW `aluguelbarco_cliente`  AS  select `aluguelbarco`.`id` AS `id`,`pagamentos`.`fk_usuario` AS `fk_usuario`,`aluguelbarco`.`fk_embarcacao` AS `fk_embarcacao`,`embarcacao`.`nome` AS `nome_embarcacao`,`embarcacao`.`cidade` AS `cidade`,`aluguelbarco`.`fk_empresa` AS `fk_empresa`,`empresabarco`.`razao` AS `razao`,count(`passageiros`.`fk_aluguelbarco`) AS `num_pessoas`,`passageiros`.`fk_pagamento` AS `fk_pagamento`,`pagamentos`.`valor` AS `valor`,`pagamentos`.`porcentagem` AS `porcentagem`,`aluguelbarco`.`data_aluguel` AS `data_aluguel` from ((((`aluguelbarco` join `embarcacao` on(`aluguelbarco`.`fk_embarcacao` = `embarcacao`.`id`)) join `empresabarco` on(`aluguelbarco`.`fk_empresa` = `empresabarco`.`id`)) join `passageiros` on(`aluguelbarco`.`id` = `passageiros`.`fk_aluguelbarco`)) join `pagamentos` on(`passageiros`.`fk_pagamento` = `pagamentos`.`id`)) group by `pagamentos`.`id` ;

-- --------------------------------------------------------

--
-- Estrutura para view `aluguelbarco_empresa`
--
DROP TABLE IF EXISTS `aluguelbarco_empresa`;

CREATE ALGORITHM=UNDEFINED DEFINER=`u526894748_pic`@`127.0.0.1` SQL SECURITY DEFINER VIEW `aluguelbarco_empresa`  AS  select `aluguelbarco`.`id` AS `id`,`aluguelbarco`.`fk_empresa` AS `fk_empresa`,`aluguelbarco`.`fk_embarcacao` AS `fk_embarcacao`,`embarcacao`.`nome` AS `nome_embarcacao`,count(`passageiros`.`fk_aluguelbarco`) AS `num_passageiros`,`aluguelbarco`.`lim_passageiros` AS `lim_passageiros`,`aluguelbarco`.`data_aluguel` AS `data_aluguel`,`aluguelbarco`.`valor` AS `valor`,`aluguelbarco`.`status` AS `status` from ((`aluguelbarco` join `embarcacao` on(`aluguelbarco`.`fk_embarcacao` = `embarcacao`.`id`)) left join `passageiros` on(`aluguelbarco`.`id` = `passageiros`.`fk_aluguelbarco`)) group by `aluguelbarco`.`id` ;

-- --------------------------------------------------------

--
-- Estrutura para view `extrato`
--
DROP TABLE IF EXISTS `extrato`;

CREATE ALGORITHM=UNDEFINED DEFINER=`u526894748_pic`@`127.0.0.1` SQL SECURITY DEFINER VIEW `extrato`  AS  select `pagamentos`.`id` AS `id`,`pagamentos`.`fk_empresa` AS `fk_empresa`,`pagamentos`.`fk_usuario` AS `fk_usuario`,`pagamentos`.`valor` AS `valor`,`pagamentos`.`data_pagamento` AS `data_pagamento`,`embarcacao`.`nome` AS `nome`,`usuario`.`nome` AS `cliente` from ((((`pagamentos` join `passageiros` on(`pagamentos`.`id` = `passageiros`.`fk_pagamento`)) join `aluguelbarco` on(`passageiros`.`fk_aluguelbarco` = `aluguelbarco`.`id`)) join `embarcacao` on(`aluguelbarco`.`fk_embarcacao` = `embarcacao`.`id`)) join `usuario` on(`pagamentos`.`fk_usuario` = `usuario`.`id`)) group by `pagamentos`.`id` union select `pagamentos`.`id` AS `id`,`pagamentos`.`fk_empresa` AS `fk_empresa`,`pagamentos`.`fk_usuario` AS `fk_usuario`,`pagamentos`.`valor` AS `valor`,`pagamentos`.`data_pagamento` AS `data_pagamento`,`embarcacao`.`nome` AS `nome`,`usuario`.`nome` AS `cliente` from (((`pagamentos` join `alugalancha` on(`pagamentos`.`id` = `alugalancha`.`fk_pagamento`)) join `embarcacao` on(`alugalancha`.`fk_embarcacao` = `embarcacao`.`id`)) join `usuario` on(`pagamentos`.`fk_usuario` = `usuario`.`id`)) group by `pagamentos`.`id` ;

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
  ADD KEY `fk_vendemp` (`fk_empresa`),
  ADD KEY `fk_lancha_pagamento` (`fk_pagamento`);

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
  ADD UNIQUE KEY `numero` (`numero`),
  ADD KEY `fk_barco_emp` (`fk_empbarco`);

--
-- Índices de tabela `empresabarco`
--
ALTER TABLE `empresabarco`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cnpj` (`cnpj`);

--
-- Índices de tabela `empresadetalhes`
--
ALTER TABLE `empresadetalhes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `fk_empresa` (`fk_empresa`);

--
-- Índices de tabela `endemp`
--
ALTER TABLE `endemp`
  ADD PRIMARY KEY (`fk_empresa`);

--
-- Índices de tabela `endereco`
--
ALTER TABLE `endereco`
  ADD PRIMARY KEY (`fk_usuario`);

--
-- Índices de tabela `fotoembar`
--
ALTER TABLE `fotoembar`
  ADD PRIMARY KEY (`fk_embar`);

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
  ADD KEY `fk_pass_aluguelbarco` (`fk_aluguelbarco`),
  ADD KEY `fk_barco_pagamento` (`fk_pagamento`),
  ADD KEY `fk_pass_usuario` (`fk_usuario`);

--
-- Índices de tabela `socio`
--
ALTER TABLE `socio`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cpf` (`cpf`),
  ADD KEY `fk_empresa` (`fk_empresa`);

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
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`);

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
-- AUTO_INCREMENT de tabela `empresadetalhes`
--
ALTER TABLE `empresadetalhes`
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
-- AUTO_INCREMENT de tabela `socio`
--
ALTER TABLE `socio`
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
  ADD CONSTRAINT `fk_lancha_pagamento` FOREIGN KEY (`fk_pagamento`) REFERENCES `pagamentos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_lancha_usuario` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
  ADD CONSTRAINT `fk_barco_pagamento` FOREIGN KEY (`fk_pagamento`) REFERENCES `pagamentos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pass_aluguelbarco` FOREIGN KEY (`fk_aluguelbarco`) REFERENCES `aluguelbarco` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pass_usuario` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `socio`
--
ALTER TABLE `socio`
  ADD CONSTRAINT `fk_socio_emp` FOREIGN KEY (`fk_empresa`) REFERENCES `empresabarco` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `tripulantes`
--
ALTER TABLE `tripulantes`
  ADD CONSTRAINT `fk_tripu_aluguelbarco` FOREIGN KEY (`fk_aluguelbarco`) REFERENCES `aluguelbarco` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
