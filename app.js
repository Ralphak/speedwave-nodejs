//Variáveis de ambiente
require("dotenv").config({path:"variables.env"});

const
    express = require("express"),
    app = express(),
    passport = require("passport"),
    port = process.env.PORT || 8000;


//Inicializações
app.use(express.static(__dirname + "/public"));
app.use(require("body-parser").urlencoded({extended:false}));
app.use(require("express-session")({secret: 'equipeUVA', resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require("flash")());
app.use(require("express-fileupload")());
app.use(require("./routes.js"));

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