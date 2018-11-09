const passport = require("passport"),
      LocalStrategy = require('passport-local').Strategy,
      crypto = require('crypto'),
      mysql = require("./mysql.js");


passport.serializeUser(function(user, done) {
  done(null, user.cnpj);
});

passport.deserializeUser(function(id, done) {
  mysql.query(`select * from Empresa where cnpj=${id} limit 1`, (err, user)=>{
    done(err, user);
  });
});

passport.use('local', new LocalStrategy({
	usernameField: 'usuario',
	passwordField: 'senha',
  passReqToCallback : true
}, function(req, username, password, done) {
  // Verifica se o usuário existe ou não
  mysql.query(`select * from Empresa where cnpj=${username} limit 1`, (err, user)=>{
    // Em caso de erro, retorne usando o método done
    if (err){
      console.log("Erro no login:");
      return done(err);
    }
    user = user.pop();
    // Nome de usuário não existe, logar o erro & redirecione de volta
    if (!user){
      console.log('Usuário não encontrado para usuário '+username);
      return done(null, false, req.flash('message', 'Usuário não encontrado.'));
    }
    // Usuário existe mas a senha está errada, logar o erro
    //password = crypto.createHash('sha256').update(password).digest('base64');
    if (password != user.senha){
      console.log('Senha Inválida');
      return done(null, false, req.flash('message', 'Senha Inválida'));
    }
    // Tanto usuário e senha estão corretos, retorna usuário através do método done, e, agora, será considerado um sucesso
    console.log("logado como", user.razaoSocial);
    return done(null, user);
  });
}));

module.exports = passport;