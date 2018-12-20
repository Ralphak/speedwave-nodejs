const passport = require("passport"),
      LocalStrategy = require('passport-local').Strategy,
      crypto = require('crypto'),
      mysql = require("./mysql.js");

var tabela, chave;


passport.serializeUser(function(user, done) {
  done(null, user[chave]);
});

passport.deserializeUser(function(id, done) {
  mysql.query(`select * from ${tabela} where ${chave}="${id}" limit 1`, (err, user)=>{
    delete user[0].senha;
    done(err, user[0]);
  });
});

passport.use('empresa', new LocalStrategy({
  usernameField: 'usuario',
  passwordField: 'senha',
  passReqToCallback : true
}, function(req, username, password, done){
  login(req, username, password, done, "empresabarco", "cnpj");
}));

passport.use('socio', new LocalStrategy({
  usernameField: 'usuario',
  passwordField: 'senha',
  passReqToCallback : true
}, function(req, username, password, done){
  login(req, username, password, done, "socio_login", "cpf");
}));

passport.use('cliente', new LocalStrategy({
  usernameField: 'usuario',
  passwordField: 'senha',
  passReqToCallback : true
}, function(req, username, password, done){
  login(req, username, password, done, "usuario", "login");
}));

function login(req, username, password, done, _tabela, _chave){
  // Exportar os nomes da tabela e da chave primária
  tabela = _tabela;
  chave = _chave;
  // Verifica se o usuário existe ou não
  mysql.query(`select ${chave}, senha from ${tabela} where ${chave}="${username}" limit 1`, (err, user)=>{
    // Em caso de erro, retorne usando o método done
    if (err){
      return done(err);
    }
    user = user.pop();
    // Nome de usuário não existe, logar o erro & redirecione de volta
    if (!user){
      return done(null, false, req.flash('message', 'Usuário não encontrado.'));
    }
    // Usuário existe mas a senha está errada, logar o erro
    //password = crypto.createHash('sha256').update(password).digest('base64');
    if (password != user.senha){
      return done(null, false, req.flash('message', 'Senha incorreta.'));
    }
    // Tanto usuário e senha estão corretos, retorna usuário através do método done, e agora será considerado um sucesso
    return done(null, user);
  });
}

module.exports = passport;