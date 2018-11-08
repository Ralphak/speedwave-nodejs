const
    express = require("express"),
    router = express.Router(),
    mysql = require("./mysql.js"),
    passport = require("./passport.js");


//Inclui um formulário no banco de dados
router.post('/api/incluir/:tabela', (req, res)=>{
    mysql.query("insert into " + req.params.tabela + " set ?", req.body, (err, results)=>{
        if (err) {
            res.send(err.stack);
            return;
        }
        console.log("Linhas afetadas: " + results.affectedRows);
        res.send(`<p>Cadastro realizado com sucesso!</p><a href="/">Voltar ao site</a>`);
    });
});

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

//Requisição de login
router.post('/api/login', passport.authenticate('local', {
	failureFlash : true
}), function(req,res){
    if (req.body.urlDestino) {
        res.redirect(req.body.urlDestino);
    } else {
        res.redirect("/");
    }
});

//Desconectar usuário
router.get('/api/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

//Obter usuário
router.get('/api/usuario', (req, res)=>{
    if(req.user){
        res.json(req.user[0]);
    } else{
        res.json(null);
    }
});

router.get('/api/teste', (req, res)=>{
});

module.exports = router;