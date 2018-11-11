const passport = require("passport"),
      LocalStrategy = require('passport-local').Strategy,
      crypto = require('crypto'),
      mysql = require("./mysql.js");


function loginAPI (tabela, chave){
  this.passport = passport;
  
  passport.serializeUser(function(user, done) {
    done(null, Object.values(user)[0]);
  });
  
  passport.deserializeUser(function(id, done) {
    mysql.query(`select * from ${tabela} where ${chave}=${id} limit 1`, (err, user)=>{
      user = user.pop();
      done(err, user);
    });
  });
  
  passport.use('local', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'senha',
    passReqToCallback : true
  }, function(req, username, password, done) {
    // Verifica se o usuário existe ou não
    mysql.query(`select ${chave}, senha from ${tabela} where ${chave}=${username} limit 1`, (err, user)=>{
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
      password = crypto.createHash('sha256').update(password).digest('base64');
      if (password != user.senha){
        return done(null, false, req.flash('message', 'Senha incorreta.'));
      }
      // Tanto usuário e senha estão corretos, retorna usuário através do método done, e agora será considerado um sucesso
      delete user['senha'];
      return done(null, user);
    });
  }));
}

module.exports = loginAPI;