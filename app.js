//Variáveis de ambiente
require("dotenv").config({path:"variables.env"});

const
    //Importando os módulos npm
    bodyParser = require("body-parser"),
    express = require("express"),
    expressSession = require("express-session"),
    passport = require("passport"),

    //Variáveis locais
    app = express(),
    port = process.env.port || 8000,
    routes = require("./routes.js");


//Inicializações
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(expressSession({secret: 'minhaChaveSecreta', resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require("flash")());
app.use(routes);

//certificado SSL
/*var credentials = {
    key: fs.readFile('key.pem', 'utf8'),
    cert: fs.readFile('cert.pem', 'utf8')
};*/

//Carregar o servidor
//https.createServer(credentials, app).listen(port, function(){
app.listen(port, ()=>{
    console.log(`Servidor iniciado na porta ${port}`)
})