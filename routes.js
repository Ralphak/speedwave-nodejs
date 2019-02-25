const express = require("express"),
    router = express.Router(),
    mysql = require("./mysql"),
    loginAPI = require("./login-api"),
    crypto = require("crypto"),
    getnet = require("./client-oauth2"),
    nodemailer = require("./nodemailer"),
    ftp = require("./ftp"),
    moment = require("moment");
    
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
    
//Altera a senha do usuário
router.post('/api/alterar/senha', (req, res)=>{
    Object.keys(req.body).map(senha=>{
        req.body[senha] = crypto.createHash('sha1').update(req.body[senha]).digest('base64');
    });
    let tabela, idUsuario = req.user.id;
    switch(vinculoUsuario){
        case "empresa": tabela="empresabarco";
            break;
        case "socio": tabela="socio";
            idUsuario = req.user.id_socio;
            break;
        case "cliente": tabela="usuario";
            break;
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
            conn.query(`select senha from ${tabela} where id=${idUsuario}`, (err, results)=>{
                if(err){
                    nodemailer.enviarErro(err.stack);
                    conn.rollback(()=>{res.send(err.stack);});
                    return;
                }
                if(req.body.senha_atual != results[0].senha){
                    conn.rollback(()=>{
                        req.flash('message', 'Senha incorreta.');
                        res.redirect('/#alterar-senha');
                    });
                    return;
                }
                conn.query(`update ${tabela} set senha="${req.body.senha}" where id=${idUsuario}`, (err, results)=>{
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
                        res.redirect('/#sucesso');
                    });
                });
            });
        });
    });
});
    
//Exclui uma entrada de uma tabela
router.post('/api/excluir/:tabela', (req, res)=>{
    mysql.query("delete from " + req.params.tabela + " where id=?", req.body.id, (err, results)=>{
        if(err){
            nodemailer.enviarErro(err.stack);
            res.send(err.stack);
            return;
        }
        res.redirect(req.body.url);        
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
                let pasta = `/barcos/${results.insertId}/`;
                let fotosEmbarcacao = {
                    fk_embar : results.insertId,
                    proa : pasta + req.files.proa.name, 
                    popa : pasta + req.files.popa.name, 
                    traves : pasta + req.files.traves.name, 
                    interior1 : pasta + req.files.interior1.name, 
                    interior2 : pasta + req.files.interior2.name, 
                    interior3 : pasta + req.files.interior3.name
                };
                conn.query("insert into fotoembar set ?", fotosEmbarcacao, (err, results)=>{
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
                        ftp.upload(req.files, pasta);
                        nodemailer.enviarMensagem(req.user.email, "Registro de embarcação em análise", `${req.user.razao},<br><br>Seu pedido de cadastro da embarcação ${req.body.nome} foi recebido e será analisado em breve. Aguarde um novo email contendo nossa resposta.`);
                        res.redirect('/#lista-embarcacoes');
                    });
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
router.post('/getnet/registrar', (req, res)=>{
    console.log(req.body);
    let tabelaAluguel,
        dadosTransacao = {
            id : bitmask[1],
            fk_empresa : bitmask[2],
            fk_usuario : req.user.id,
            valor : bitmask[3],
            data_pagamento : new Date(),
            porcentagem : bitmask[5]
        };
    if(bitmask[0] == 0){
        nomes = req.query.nome.split(","); //Separa os nomes das pessoas
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
                    tabelaAluguel = "aluguelbarco_cliente";
                    tipoServico = "Passeio de Barco";
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
                    tabelaAluguel = "alugalancha_cliente";
                    tipoServico = "Aluguel de Lancha";
                    let arrayValores = [req.user.id, bitmask[1], "Alugado", bitmask[4]];
                    conn.query("update alugalancha set fk_usuario=?, fk_pagamento=?, status=? where id=?", arrayValores, (err, results)=>{
                        if(err){
                            nodemailer.enviarErro(err.stack);
                            conn.rollback(()=>{res.send(err.stack);});
                            return;
                        }
                    });
                }
                conn.query(`select nome_embarcacao, cidade, razao, data_aluguel from ${tabelaAluguel} where id=${bitmask[4]}`, (err, results)=>{
                    if(err){
                        nodemailer.enviarErro(err.stack);
                        conn.rollback(()=>{res.send(err.stack);});
                        return;
                    }
                    let listaNomes="";
                    if(bitmask[0] == 0){
                        listaNomes += "<b>Lista de pessoas</b><br>";
                        nomes.forEach(nome=>{
                            listaNomes += nome + "<br>";
                        });
                        listaNomes += "<br>";
                    }
                    nodemailer.enviarMensagem(req.user.email, "Compra efetuada", `Prezado(a) ${req.user.nome},<br><br>
                        Agradecemos pela sua compra realizada em nosso site! Segue abaixo os detalhes da transação:<br><br>
                        <b>Tipo de Serviço:</b> ${tipoServico}<br>
                        <b>Embarcação:</b> ${results[0].nome_embarcacao}<br>
                        <b>Empresa:</b> ${results[0].razao}<br>
                        <b>Cidade:</b> ${results[0].cidade}<br>
                        <b>Data do serviço:</b> ${moment(results[0].data_aluguel).format("DD/MM/YYYY HH:mm")}<br>
                        <b>Valor total:</b> R$${parseFloat(dadosTransacao.valor).toFixed(2)}<br>
                        <b>Valor pago:</b> R$${(parseFloat(dadosTransacao.valor)*parseFloat(dadosTransacao.porcentagem)).toFixed(2)}<br>
                        <b>Valor a pagar ao proprietário:</b> R$${(parseFloat(dadosTransacao.valor)*(1-parseFloat(dadosTransacao.porcentagem))).toFixed(2)}<br>
                        <br>${listaNomes}
                        Você também pode conferir os detalhes na aba "Meus Serviços" do site, após realizar o login.<br><br>
                        Lembre-se de que você ainda deve pagar o restante do valor diretamente ao proprietário da embarcação!<br><br>
                        Grato,<br>Equipe Speed Wave
                    `);
                    conn.commit((err)=>{
                        if(err){
                            nodemailer.enviarErro(err.stack);
                            conn.rollback(()=>{res.send(err.stack);});
                            return;
                        }
                        res.redirect('/#sucesso');
                    });
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
    let empresasAprovadas=[], barcosAprovados=[], empresasRecusadas={}, barcosRecusados={}, idRecusado;
    //Organizar dados nos arrays
    Object.entries(req.body).forEach(itemForm=>{
        let atributosNome = itemForm[0].split(/[_-]/);
        if(atributosNome[0] == "radio"){
            if(atributosNome[1] == "empresa"){
                if(itemForm[1] == 1) empresasAprovadas.push(atributosNome[2]);
                else idRecusado = atributosNome[2];
            }
            else if(atributosNome[1] == "barco"){
                if(itemForm[1] == 1) barcosAprovados.push(atributosNome[2]);
                else idRecusado = atributosNome[2];
            }
        } else if(atributosNome[0] == "justificativa"){
            if(atributosNome[1] == "empresa") empresasRecusadas[idRecusado] = itemForm[1];
            else if(atributosNome[1] == "barco") barcosRecusados[idRecusado] = itemForm[1];
        }
    });
    //Autorizar empresas aprovadas
    if(empresasAprovadas.length > 0){
        mysql.query(`update empresabarco set autorizado=1 where id in(${empresasAprovadas})`, (err, results)=>{
            if(err){
                nodemailer.enviarErro(err.stack);
                res.send(err.stack);
                return;
            }
            mysql.query(`select razao, email from empresabarco where id in(${empresasAprovadas})`, (err, results)=>{
                results.forEach(result=>{
                    nodemailer.enviarMensagem(result.email, "Sua empresa foi aprovada", `${result.razao},<br><br>A sua empresa foi aprovada em nosso site! Você já pode logar usando o CNPJ/MEI e senha cadastrados!`);
                });
            });
        });
    }
    //Autorizar barcos aprovados
    if(barcosAprovados.length > 0){
        mysql.query(`update embarcacao set autorizado=1 where id in(${barcosAprovados})`, (err, results)=>{
            if(err){
                nodemailer.enviarErro(err.stack);
                res.send(err.stack);
                return;
            }
            mysql.query(`select nome, empresabarco.razao, empresabarco.email from embarcacao join empresabarco on fk_empbarco=empresabarco.id where embarcacao.id in(${barcosAprovados})`, (err, results)=>{
                results.forEach(result=>{
                    nodemailer.enviarMensagem(result.email, "Sua embarcação foi aprovada", `${result.razao},<br><br>A sua embarcação de nome ${result.nome} foi aprovada e adicionada à sua conta!`);
                });
            });
        });
    }
    //Excluir empresas recusadas
    if(Object.keys(empresasRecusadas).length > 0){
        mysql.query(`select id, razao, email from empresabarco where id in(${Object.keys(empresasRecusadas)})`, (err, results)=>{
            if(err){
                nodemailer.enviarErro(err.stack);
                res.send(err.stack);
                return;
            }
            mysql.query(`delete from empresabarco where id in(${Object.keys(empresasRecusadas)})`, (err)=>{
                if(err){
                    nodemailer.enviarErro(err.stack);
                    res.send(err.stack);
                    return;
                }
                results.forEach(result=>{
                    ftp.delete(`/empresas/${result.id}`);
                    nodemailer.enviarMensagem(result.email, "Sua empresa foi recusada", `${result.razao},<br><br>A sua empresa foi recusada em nosso site.<br><br>Motivo: ${empresasRecusadas[result.id]}<br><br>Seu cadastro foi excluído para que possa refazê-lo com as informações corretas.`);
                });
            });
        });
    }
    //Excluir barcos recusados
    if(Object.keys(barcosRecusados).length > 0){
        mysql.query(`select embarcacao.id, nome, empresabarco.razao, empresabarco.email from embarcacao join empresabarco on fk_empbarco=empresabarco.id where embarcacao.id in(${Object.keys(barcosRecusados)})`, (err, results)=>{
            console.log(results);
            if(err){
                nodemailer.enviarErro(err.stack);
                res.send(err.stack);
                return;
            }
            mysql.query(`delete from embarcacao where id in(${Object.keys(barcosRecusados)})`, (err)=>{
                if(err){
                    nodemailer.enviarErro(err.stack);
                    res.send(err.stack);
                    return;
                }
                results.forEach(result=>{
                    ftp.delete(`/barcos/${result.id}`);
                    nodemailer.enviarMensagem(result.email, "Sua embarcação foi recusada", `${result.razao},<br><br>A sua embarcação de nome ${result.nome} foi recusada em nosso site.<br><br>Motivo: ${barcosRecusados[result.id]}<br><br>O cadastro da embarcação foi excluído para que possa refazê-lo com as informações corretas.`);
                });
            });
        });
    }
    res.redirect('/#admin');
});

//Envia uma nova senha aleatória para o email inserido
router.post('/api/novasenha', (req, res)=>{
    let tabelas = {empresabarco:"cnpj", socio:"cpf", usuario:"login"};
    Object.entries(tabelas).forEach(tabela=>{
        mysql.query(`select ${tabela[1]}, senha from ${tabela[0]} where email="${req.body.email}"`, (err, results)=>{
            if(err){
                nodemailer.enviarErro(err.stack);
                res.send(err.stack);
                return;
            }
            if(results.length > 0) results.forEach(result=>{
                let tipoConta="cliente", senhaNova = Math.random().toString(36).substring(2);
                if(tabela[0]=="empresabarco") tipoConta="empresa";
                else if(tabela[0]=="socio") tipoConta="sócio";
                mysql.query(`update ${tabela[0]} set senha="${crypto.createHash('sha1').update(senhaNova).digest('base64')}" where email="${req.body.email}"`, (err)=>{
                    if(err){
                        nodemailer.enviarErro(err.stack);
                        res.send(err.stack);
                        return;
                    }
                    nodemailer.enviarMensagem(req.body.email, "Senha temporária", `Atendendo ao seu pedido, foi gerada uma senha aleatória para a sua conta de ${tipoConta}. Segue abaixo as suas credenciais:<br><br>${tabela[1]}: ${result[tabela[1]]}<br>senha: ${senhaNova}<br><br>Recomendamos que troque essa senha assim que possível, através da opção "Alterar Senha" em nosso site.`);
                });
            });
        });
    });
    res.redirect("/#login");
});

module.exports = router;