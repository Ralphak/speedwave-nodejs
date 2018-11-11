const express = require("express"),
    router = express.Router(),
    mysql = require("./mysql.js"),
    loginAPI = require("./login-api.js"),
    crypto = require("crypto");
    

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
    let dadosEmpresa = {
            razao : req.body.razao, 
            cnpj : req.body.cnpj, 
            info : req.body.info, 
            titular : req.body.titular, 
            data_inicio : req.body.data_inicio, 
            telefone : req.body.telefone, 
            email : req.body.email, 
            senha : req.body.senha
        }, 
        dadosEndereco = {
            fk_empresa : '',
            rua : req.body.rua, 
            cep : req.body.cep, 
            bairro : req.body.bairro, 
            cidade : req.body.cidade, 
            estado : req.body.estado, 
            pais : req.body.pais
        }, 
        dadosPagamento = {
            fk_empbarco : '',
            cpf : req.body.cpf, 
            banco : req.body.banco, 
            agencia : req.body.agencia, 
            conta : req.body.conta
        };
    mysql.beginTransaction((err)=>{
        if (err) {
            res.send(err.stack);
            return;
        }
        mysql.query("insert into empresabarco set ?", dadosEmpresa, (err, results)=>{
            if (err) {
                mysql.rollback(()=>{res.send(err.stack);});
                return;
            }
            console.log(results);
            let idEmpresa = results.insertId;
            dadosEndereco.fk_empresa = idEmpresa;
            mysql.query("insert into endemp set ?", dadosEndereco, (err, results)=>{
                if (err) {
                    mysql.rollback(()=>{res.send(err.stack);});
                    return;
                }
                dadosPagamento.fk_empbarco = idEmpresa;
                mysql.query("insert into bancoempbarco set ?", dadosPagamento, (err, results)=>{
                    if (err) {
                        mysql.rollback(()=>{res.send(err.stack);});
                        return;
                    }
                    mysql.commit((err)=>{
                        if (err) {
                            mysql.rollback(()=>{res.send(err.stack);});
                            return;
                        }
                        res.redirect('/#sucesso');
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
        default:
            res.send("Opção de vínculo não atribuída ao método de login.");
            return;
    }
    let login = new loginAPI(tabela, chave);
    login.passport.authenticate('local', {
        failureFlash : true,
        failureRedirect : '/#login',
        successRedirect : '/'
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