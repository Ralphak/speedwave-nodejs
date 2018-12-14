const express = require("express"),
    router = express.Router(),
    mysql = require("./mysql.js"),
    loginAPI = require("./login-api.js"),
    crypto = require("crypto");
    
var vinculoUsuario;


//Busca todas as entradas de uma tabela, ou as definidas por ?colunas=x,y&filtro=where...
router.get('/api/buscar/:tabela', (req, res)=>{
    if(!req.query.colunas){
        req.query.colunas = "*";
    }
    mysql.query(`select ${req.query.colunas} from ${req.params.tabela} ${req.query.filtro}`, (err, results)=>{
        if (err) {
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
    
//Inclui um formulário no banco de dados. Método geral.
router.post('/api/incluir/:tabela', (req, res)=>{
    if(req.body.senha){
        req.body.senha = crypto.createHash('sha256').update(req.body.senha).digest('base64');
    }
    mysql.query("insert into " + req.params.tabela + " set ?", req.body, (err, results)=>{
        if (err) {
            res.send(err.stack);
            return;
        }
        //console.log("Linhas afetadas: " + results.affectedRows);
        res.redirect('/#sucesso');
    });
});

//Inclui um cadastro de empresa no banco de dados.
router.post('/api/cadastrar/empresa', (req, res)=>{
    req.body.senha = crypto.createHash('sha256').update(req.body.senha).digest('base64');
    let tabelaEmpresa, tabelaEndereco, tabelaBanco;
    if(req.body.vinculo=="proprietario"){
        tabelaEmpresa="empresabarco";
        tabelaEndereco="endemp";
        tabelaBanco="bancoempbarco";
    } else{
        tabelaEmpresa="vendemp";
        tabelaEndereco="endvendemp";
        tabelaBanco="bancovendemp";
    }
    let dadosEmpresa = {
            razao : req.body.razao, 
            cnpj : req.body.cnpj, 
            info : req.body.info, 
            titular : req.body.titular, 
            data_inicio : req.body.data_inicio, 
            telefone : req.body.telefone, 
            email : req.body.email, 
            senha : req.body.senha,
            documento1 : req.files.documento1.data.toString("base64")+'.'+req.files.documento1.mimetype
        }, 
        dadosEndereco = {
            rua : req.body.rua, 
            cep : req.body.cep, 
            bairro : req.body.bairro, 
            cidade : req.body.cidade, 
            estado : req.body.estado, 
            pais : req.body.pais
        }, 
        dadosPagamento = {
            cpf : req.body.cpf, 
            banco : req.body.banco, 
            agencia : req.body.agencia, 
            conta : req.body.conta
        };
    mysql.getConnection((err, conn)=>{
        if (err) {
            res.send(err.stack);
            return;
        }
        conn.beginTransaction((err)=>{
            if (err) {
                res.send(err.stack);
                return;
            }
            conn.query(`insert into ${tabelaEmpresa} set ?`, dadosEmpresa, (err, results)=>{
                if (err) {
                    conn.rollback(()=>{res.send(err.stack);});
                    return;
                }
                let idEmpresa = results.insertId;
                if(req.body.vinculo=="proprietario"){
                    dadosEndereco.fk_empresa = idEmpresa;
                } else{
                    dadosEndereco.fk_vendemp = idEmpresa;
                }
                conn.query(`insert into ${tabelaEndereco} set ?`, dadosEndereco, (err, results)=>{
                    if (err) {
                        conn.rollback(()=>{res.send(err.stack);});
                        return;
                    }
                    if(req.body.vinculo=="proprietario"){
                        dadosPagamento.fk_empresa = idEmpresa;
                    } else{
                        dadosPagamento.fk_vendemp = idEmpresa;
                    }
                    conn.query(`insert into ${tabelaBanco} set ?`, dadosPagamento, (err, results)=>{
                        if (err) {
                            conn.rollback(()=>{res.send(err.stack);});
                            return;
                        }
                        conn.commit((err)=>{
                            if (err) {
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
});

//Inclui um cadastro de embarcação no banco de dados.
router.post('/api/cadastrar/embarcacao', (req, res)=>{
    let dadosEmbarcacao = {
            nome : req.body.nome, 
            categoria : req.body.categoria, 
            numero : req.body.numero, 
            data : req.body.data, 
            validade : req.body.validade, 
            capacidade : req.body.capacidade, 
            qtd_tripulantes : req.body.qtd_tripulantes, 
            atividade : req.body.atividade,
            area_nav : req.body.area_nav,
            cidade : req.body.cidade,
            fk_empbarco : req.body.fk_empbarco,
            valor: req.body.valor,
            documento1 : req.files.documento1.data.toString("base64")+'.'+req.files.documento1.mimetype
        }, fotosEmbarcacao = {
            proa : req.files.proa.data.toString("base64")+'.'+req.files.proa.mimetype, 
            popa : req.files.popa.data.toString("base64")+'.'+req.files.popa.mimetype, 
            través : req.files.través.data.toString("base64")+'.'+req.files.través.mimetype, 
            interior1 : req.files.interior1.data.toString("base64")+'.'+req.files.interior1.mimetype, 
            interior2 : req.files.interior2.data.toString("base64")+'.'+req.files.interior2.mimetype, 
            interior3 : req.files.interior3.data.toString("base64")+'.'+req.files.interior3.mimetype
        };
    mysql.getConnection((err, conn)=>{
        if (err) {
            res.send(err.stack);
            return;
        }
        conn.beginTransaction((err)=>{
            if (err) {
                res.send(err.stack);
                return;
            }
            conn.query("insert into embarcacao set ?", dadosEmbarcacao, (err, results)=>{
                if (err) {
                    conn.rollback(()=>{res.send(err.stack);});
                    return;
                }
                fotosEmbarcacao.fk_embar = results.insertId;
                conn.query("insert into fotoembar set ?", fotosEmbarcacao, (err, results)=>{
                    if (err) {
                        conn.rollback(()=>{res.send(err.stack);});
                        return;
                    }
                    conn.commit((err)=>{
                        if (err) {
                            conn.rollback(()=>{res.send(err.stack);});
                            return;
                        }
                        res.redirect('/#lista-embarcacoes');
                    });
                });
            });
        });
    });
});

//Requisição de login.
router.post('/api/login', (req, res)=>{
    let tabela, chave;
    switch(req.body.vinculo){
        case "proprietario":
            tabela="empresabarco";
            chave="cnpj";
            break;
        case "vendedor":
            tabela="vendemp";
            chave="cnpj";
            break;
        default:
            res.send("Opção de vínculo não atribuída ao método de login.");
            return;
    }
    vinculoUsuario = req.body.vinculo;
    let login = new loginAPI(tabela, chave);
    login.passport.authenticate('local', {
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
        let usuario = req.user;
        delete usuario['senha'];
        usuario.vinculo = vinculoUsuario;
        res.json(usuario);
    } else if(req.params.dados=="flash" && res.locals.flash.length > 0){
        res.json(res.locals.flash.pop());
    } else{
        res.json(null);
    }
});

router.post('/api/teste', (req, res)=>{
    res.send(req.body);
});

module.exports = router;