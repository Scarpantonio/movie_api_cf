// each strategy is a module that allows us to authenticate and authorice users.

const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,  
      Models = require('./models.js'),
      passportJWT = require('passport-jwt');

let   Users = Models.User,
      JWTStrategy = passportJWT.Strategy,
      ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
  // colocamos fields que queremos autenticar
  usernameField: 'Username',
  passwordField: 'Password'
  }, 
  (username, password, callback) => {
  console.log(username + '  ' + password);
  Users.findOne({ Username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error); // return done
    }
    if (!user) {
      console.log('incorrect username');
      return callback(null, false, {message: 'Incorrect username.'});
    }
    if (!user.validatePassword(password)) {
      console.log('incorrect password');
      return callback(null, false, {message: 'Incorrect password.'});
    }
    console.log('finished');
    return callback(null, user); // retorn user, y en las otras false xq el verufy callback tuvo problemas al encontrar al usuario/passwrod.  
  });
}));
  
  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secrets-are-a-good-things'},
    (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
  }));