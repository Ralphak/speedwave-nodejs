const
    express = require("express"),
    router = express.Router(),
    mysql = require("./mysql.js"),
    passport = require("./passport.js"),
    crypto = require("crypto");
    

//Busca todas as entradas de uma tabela, ou as definidas por ?colunas=x,y&filtro=where...
router.get('/api/buscar/:tabela', (req, res)=>{
    if(req.query.colunas == undefined){
        req.query.colunas = "*";
    }
    mysql.query(`select ${req.query.colunas} from ${req.params.tabela} ${req.query.filtro}`, (err, results)=>{
        if (err) {
            res.send(err.stack);
            return;
        }
        res.json(results);
    });
});
    
//Inclui um formulário no banco de dados. Método genérico.
router.post('/api/incluir/:tabela', (req, res)=>{
    if(req.body.senha){
        req.body.senha = crypto.createHash('sha256').update(req.body.senha).digest('base64');
    }
    mysql.query("insert into " + req.params.tabela + " set ?", req.body, (err, results)=>{
        if (err) {
            res.send(err.stack);
            return;
        }
        console.log("Linhas afetadas: " + results.affectedRows);
        res.send(`<p>Cadastro realizado com sucesso!</p><a href="/">Voltar ao site</a>`);
    });
});

//Inclui um cadastro de empresa no banco de dados.
router.post('/api/cadastrar/empresa', (req, res)=>{
    res.send("rota de empresa");
});

//Requisição de login
router.post('/api/login', passport.authenticate('local', {
    failureFlash : true,
    failureRedirect : '/#login',
    successRedirect : '/'
}));

//Desconectar usuário
router.get('/api/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

//Enviar dados do backend para o frontend
router.get('/api/dados/:dados', (req, res)=>{
    if(req.params.dados=="usuario" && req.user){
        res.json(req.user[0]);
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