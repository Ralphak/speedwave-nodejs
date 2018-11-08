ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';

drop database if exists Speedwave;
create database Speedwave;
use Speedwave;

create table Empresa (
	razaoSocial varchar(100) not null,
    cnpj bigint(14) not null,
    agencia int(5) not null,
    conta int(6) not null,
    tipoConta varchar(100) not null,
    titularConta varchar(100) not null,
    dataInicio date not null,
    endereco varchar(100) not null,
    telefone bigint(11) not null,
    email varchar(100) not null,
    senha varchar(100) not null,
    primary key (cnpj)
);
create table Socio (
    nome varchar(100) not null,
    rg int(9) not null,
    cpf bigint(11) not null,
    dataNascimento date not null,
    endereco varchar(100) not null,
    senha varchar(100) not null,
    cnpjEmpresa bigint(14) not null,
    altoNivel boolean default false,
    primary key (cpf),
    foreign key (cnpjEmpresa) references Empresa(cnpj) on delete cascade
);
create table Embarcacao (
    nome varchar(100) not null,
    inscricao varchar(20) not null,
    dataInscricao date not null,
    validade date not null,
    passageirosTotal int(4) not null,
    passageirosPermitidos int(4) default 0,
    tripulantes int(4) not null,
    atividade varchar(100) not null,
    areaNavegacao varchar(100) not null,
    cidade varchar(100) not null,
    caracteristicas varchar(1000) not null,
    detalhes varchar(1000),
    roteiro varchar(1000) not null,
    cnpjEmpresa bigint(14) not null,
    primary key (inscricao),
    foreign key (cnpjEmpresa) references Empresa(cnpj) on delete cascade
);