const express = require("express"),
    router = express.Router(),
    mysql = require("./mysql"),
    loginAPI = require("./login-api"),
    crypto = require("crypto"),
    getnet = require("./client-oauth2"),
    nodemailer = require("./nodemailer"),
    ftp = require("./ftp");
    
var vinculoUsuario;


//Busca todas as entradas de uma tabela, ou as definidas por ?colunas=x,y&filtro=where...
router.get('/api/buscar/:tabela', (req, res)=>{
    if(!req.query.colunas){
        req.query.colunas = "*";
    }
    mysql.query(`select ${req.query.colunas} from ${req.params.tabela} ${req.query.filtro}`, (err, results)=>{
        if(err){
            nodemailer.enviarErro(err.stack);
            res.send(err.stack);
            return;
        }
        results.forEach(dado => {
            //Retira a senha da busca, por segurança
            if(dado.senha) delete dado.senha;
        }); 
        res.json(results);
    });
});
    
//Inclui um formulário no banco de dados (método geral). Suporta ?redirect=
router.post('/api/incluir/:tabela', (req, res)=>{
    if(req.body.senha){
        req.body.senha = crypto.createHash('sha1').update(req.body.senha).digest('base64');
    }
    mysql.query("insert into " + req.params.tabela + " set ?", req.body, (err, results)=>{
        if(err){
            nodemailer.enviarErro(err.stack);
            res.send(err.stack);
            return;
        }
        //console.log("Linhas afetadas: " + results.affectedRows);
        if(req.query.redirect){
            res.redirect('/#'+req.query.redirect);
        } else{
            res.redirect('/#sucesso');
        }        
    });
});

//Inclui um cadastro de empresa no banco de dados.
router.post('/api/cadastrar/empresa', (req, res)=>{
    req.body.senha = crypto.createHash('sha1').update(req.body.senha).digest('base64');
    Object.keys(req.files).map(nome =>{
        req.files[nome].name = nome + "." + req.files[nome].name.split('.').pop();
    });
    let dadosEmpresa = {
            razao : req.body.razao, 
            cnpj : req.body.cnpj, 
            info : req.body.info, 
            data_inicio : req.body.data_inicio, 
            telefone : req.body.telefone, 
            email : req.body.email, 
            senha : req.body.senha
        }, 
        dadosEndereco = {
            rua : req.body.rua, 
            numero : req.body.numero, 
            complemento : req.body.complemento, 
            cep : req.body.cep, 
            bairro : req.body.bairro, 
            cidade : req.body.cidade, 
            estado : req.body.estado
        }, 
        dadosPagamento = {
            titular : req.body.titular, 
            cpf : req.body.cpf, 
            banco : req.body.banco, 
            agencia : req.body.agencia, 
            conta : req.body.conta
        };
    mysql.getConnection((err, conn)=>{
        if(err){
            nodemailer.enviarErro(err.stack);
            res.send(err.stack);
            return;
        }
        conn.beginTransaction((err)=>{
            if(err){
                nodemailer.enviarErro(err.stack);
                res.send(err.stack);
                return;
            }
            conn.query(`insert into empresabarco set ?`, dadosEmpresa, (err, results)=>{
                if(err){
                    nodemailer.enviarErro(err.stack);
                    conn.rollback(()=>{res.send(err.stack);});
                    return;
                }
                let idEmpresa = results.insertId;
                dadosEndereco.fk_empresa = idEmpresa;
                conn.query(`insert into endemp set ?`, dadosEndereco, (err, results)=>{
                    if(err){
                        nodemailer.enviarErro(err.stack);
                        conn.rollback(()=>{res.send(err.stack);});
                        return;
                    }
                    dadosPagamento.fk_empresa = idEmpresa;
                    conn.query(`insert into bancoempbarco set ?`, dadosPagamento, (err, results)=>{
                        if(err){
                            nodemailer.enviarErro(err.stack);
                            conn.rollback(()=>{res.send(err.stack);});
                            return;
                        }
                        conn.commit((err)=>{
                            if(err){
                                nodemailer.enviarErro(err.stack);
                                conn.rollback(()=>{res.send(err.stack);});
                                return;
                            }
                            ftp.upload(req.files, `/empresas/${idEmpresa}/`);
                            nodemailer.enviarMensagem(req.body.email, "Cadastro em análise", `Seu pedido de cadastro da empresa ${req.body.razao} foi recebido e será analisado em breve. Aguarde um novo email contendo nossa resposta.`);
                            res.redirect('/#sucesso');
                        });
                    });
                });
            });
        });
    });
});

//Inclui um cadastro de embarcação no banco de dados.
router.post('/api/cadastrar/embarcacao', (req, res)=>{
    Object.keys(req.files).map(nome =>{
        req.files[nome].name = nome + "." + req.files[nome].name.split('.').pop();
    });
    let dadosEmbarcacao = {
            nome : req.body.nome, 
            categoria : req.body.categoria, 
            numero : req.body.numero, 
            data : req.body.data, 
            validade : req.body.validade, 
            max_passageiros : req.body.max_passageiros, 
            max_tripulantes : req.body.max_tripulantes, 
            atividade : req.body.atividade,
            area_nav : req.body.area_nav,
            cidade : req.body.cidade,
            fk_empbarco : req.body.fk_empbarco,
            valor: req.body.valor
        };
    mysql.getConnection((err, conn)=>{
        if(err){
            nodemailer.enviarErro(err.stack);
            res.send(err.stack);
            return;
        }
        conn.beginTransaction((err)=>{
            if(err){
                nodemailer.enviarErro(err.stack);
                res.send(err.stack);
                return;
            }
            conn.query("insert into embarcacao set ?", dadosEmbarcacao, (err, results)=>{
                if(err){
                    nodemailer.enviarErro(err.stack);
                    conn.rollback(()=>{res.send(err.stack);});
                    return;
                }
                conn.commit((err)=>{
                    if(err){
                        nodemailer.enviarErro(err.stack);
                        conn.rollback(()=>{res.send(err.stack);});
                        return;
                    }
                    ftp.upload(req.files, `/embarcacoes/${results.insertId}/`);
                    nodemailer.enviarMensagem(req.user.email, "Registro de embarcação em análise", `Seu pedido de cadastro da embarcação ${req.body.nome} foi recebido e será analisado em breve. Aguarde um novo email contendo nossa resposta.`);
                    res.redirect('/#lista-embarcacoes');
                });
            });
        });
    });
});

//Inclui um cadastro de cliente no banco de dados.
router.post('/api/cadastrar/cliente', (req, res)=>{
    req.body.senha = crypto.createHash('sha1').update(req.body.senha).digest('base64');
    let dadosCliente = {
            nome : req.body.nome, 
            cpf : req.body.cpf, 
            email : req.body.email,
            telefone : req.body.telefone, 
            telefone2 : req.body.telefone2, 
            data_nasc : req.body.data_nasc, 
            login : req.body.login,
            senha : req.body.senha,
        }, 
        dadosEndereco = {
            rua : req.body.rua, 
            numero : req.body.numero, 
            complemento : req.body.complemento, 
            cep : req.body.cep, 
            bairro : req.body.bairro, 
            cidade : req.body.cidade, 
            estado : req.body.estado
        };
        mysql.getConnection((err, conn)=>{
            if(err){
                nodemailer.enviarErro(err.stack);
                res.send(err.stack);
                return;
            }
            conn.beginTransaction((err)=>{
                if(err){
                    nodemailer.enviarErro(err.stack);
                    res.send(err.stack);
                    return;
                }
                conn.query("insert into usuario set ?", dadosCliente, (err, results)=>{
                    if(err){
                        nodemailer.enviarErro(err.stack);
                        conn.rollback(()=>{res.send(err.stack);});
                        return;
                    }
                    dadosEndereco.fk_usuario = results.insertId;
                    conn.query("insert into endereco set ?", dadosEndereco, (err, results)=>{
                        if(err){
                            nodemailer.enviarErro(err.stack);
                            conn.rollback(()=>{res.send(err.stack);});
                            return;
                        }
                        conn.commit((err)=>{
                            if(err){
                                nodemailer.enviarErro(err.stack);
                                conn.rollback(()=>{res.send(err.stack);});
                                return;
                            }
                            nodemailer.enviarMensagem(req.body.email, "Bem vindo à Speed Wave", `${req.body.nome}, seu cadastro foi efeutado com sucesso!<br><br>Você já pode logar no site usando o login e senha cadastrados.`);
                            res.redirect('/#sucesso');
                        });
                    });
                });
            });
        });
});

//Requisição de login.
router.post('/api/login', (req, res)=>{
    vinculoUsuario = req.body.vinculo;
    loginAPI.authenticate(vinculoUsuario, {
        failureFlash : true,
        failureRedirect : '/#login',
        successRedirect : req.body.redirect_url
    })(req, res);
});

//Desconectar usuário
router.get('/api/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

//Enviar dados do backend para o frontend
router.get('/api/dados/:dados', (req, res)=>{
    if(req.params.dados=="usuario" && req.user){
        req.user.vinculo = vinculoUsuario;
        res.json(req.user);
    } 
    else if(req.params.dados=="flash" && res.locals.flash.length > 0){
        res.json(res.locals.flash.pop());
    } 
    else{
        res.json(null);
    }
});

//Autenticação do e-commerce na Getnet
router.get('/getnet/autenticar', (req, res)=>{
    getnet.credentials.getToken().then(user =>{
        res.json(user.data);
    });
});

//Registro de compra pelo e-commerce da Getnet
router.get('/getnet/registrar', (req, res)=>{
    let bitmask = req.query.bitmask.split(","), nomes,
        dadosTransacao = {
            id : bitmask[1],
            fk_empresa : bitmask[2],
            fk_usuario : req.user.id,
            valor : bitmask[3],
            data_pagamento : new Date()
        };
    if(bitmask[0] == 0){
        nomes = req.query.nome.split(",")
        nomes.pop(); //retira o campo em branco no final do array
    }
    mysql.getConnection((err, conn)=>{
        if(err){
            nodemailer.enviarErro(err.stack);
            res.send(err.stack);
            return;
        }
        conn.beginTransaction((err)=>{
            if(err){
                nodemailer.enviarErro(err.stack);
                res.send(err.stack);
                return;
            }
            conn.query("insert into pagamentos set ?", dadosTransacao, (err, results)=>{
                if(err){
                    nodemailer.enviarErro(err.stack);
                    conn.rollback(()=>{res.send(err.stack);});
                    return;
                }
                if(bitmask[0] == 0){ //Passeio de barco
                    nomes.forEach(nome_passageiro =>{
                        let dadosPassageiro = {
                            fk_aluguelbarco : bitmask[4],
                            fk_usuario : req.user.id,
                            nome : nome_passageiro,
                            fk_pagamento : bitmask[1]
                        };
                        conn.query("insert into passageiros set ?", dadosPassageiro, (err, results)=>{
                            if(err){
                                nodemailer.enviarErro(err.stack);
                                conn.rollback(()=>{res.send(err.stack);});
                                return;
                            }
                        });
                    });
                } else{ //Aluguel de lancha
                    let arrayValores = [req.user.id, bitmask[1], "Alugado", bitmask[4]];
                    conn.query("update alugalancha set fk_usuario=?, fk_pagamento=?, status=? where id=?", arrayValores, (err, results)=>{
                        if(err){
                            nodemailer.enviarErro(err.stack);
                            conn.rollback(()=>{res.send(err.stack);});
                            return;
                        }
                    });
                }
                conn.commit((err)=>{
                    if(err){
                        nodemailer.enviarErro(err.stack);
                        conn.rollback(()=>{res.send(err.stack);});
                        return;
                    }
                    nodemailer.enviarMensagem(req.user.email, "Compra efetuada", `Prezado ${req.user.nome},<br><br>Sua última compra no valor de R$${bitmask[3]} foi confirmada. Você pode conferir os detalhes na aba "Meus Serviços" do site, após realizar o login.`);
                    res.redirect('/#sucesso');
                });
            });
        });
    });
});

//Envia um email com o erro
router.post('/api/erro', (req, res)=>{
    nodemailer.enviarErro(req.body.erro);
});

//Recebe a variável de ambiente escolhida
router.get('/api/env/:var', (req, res)=>{
    let variavel;
    switch(req.params.var){
        case "admin":
            variavel = process.env.ADMIN_PASS;
            break;
        case "ftpPath":
            variavel = process.env.FTP_PATH;
            break;
    }
    res.json(variavel);
});

//Salva as confirmações feitas pelo administrador
router.post('/admin/autorizar', (req, res)=>{
    res.send(req.body);
});

module.exports = router;