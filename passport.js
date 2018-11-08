const passport = require("passport"),
      LocalStrategy = require('passport-local').Strategy,
      crypto = require('crypto'),
      mysql = require("./mysql.js");


passport.serializeUser(function(user, done) {
  done(null, user[0].cnpj);
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
  // verifica se o usuário existe ou não
  mysql.query(`select * from Empresa where cnpj=${username} limit 1`, (err, user)=>{
    // Em caso de erro, retorne usando o método done
    if (err){
      console.log("Erro no login:");
      return done(err);
    }
    // Nome de usuário não existe, logar o erro & redirecione de volta
    if (!user){
      console.log('Usuário não encontrado para usuário '+username);
      return done(null, false,
        req.flash('message', '<h2>Usuário não encontrado.</h2>'));
    }
    //Senha não existe para o usuário informado
    if(!user[0].senha){
        console.log('Senha inexistente para usuário '+username);
        return done(null, false,
            req.flash('message', '<h2>Senha inexistente. Para gerar uma nova senha, clique em "Esqueci minha senha" abaixo.</h2>'));
    }
    // Usuário existe mas a senha está errada, logar o erro
    /* let encPwd = crypto.createHash('sha512').update(password).digest('base64');
    if (encPwd != user[0].senha){ */
    if (password != user[0].senha){
      console.log('Senha Inválida');
      return done(null, false,
          req.flash('message', '<h2>Senha Inválida</h2'));
    }
    // Tanto usuário e senha estão corretos, retorna usuário através
    // do método done, e, agora, será considerado um sucesso
    console.log("logado como", user[0].razaoSocial);
    return done(null, user);
  });
}));

module.exports = passport;