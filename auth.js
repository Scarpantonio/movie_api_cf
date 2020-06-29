const  jwtSecret = 'my_unique_secret';
const jwt = require('jsonwebtoken');
const passport = require('passport');
// your local passpor file
require('./passport')

// Creo que el codigo a continuacion lo utilizamos para hacer que haga la info del usuaio sea almacenada dentro del header of JWT.  luego de su almacenamiento puede ser utilizada para darle los permisos al usuario en los diferentes endpoints.  

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // this is the user name your are incoding in the jwt.
        expiresIn: '7d',
        algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
    })
} 

/* POST login. this is whats happens after user has been login */
module.exports = (router) => {
    router.post('/login', (req, res) => {
      passport.authenticate('local', { session: false }, (error, user, info) => {
        if (error || !user) {
          return res.status(400).json({
            message: 'Something is not right',
            user: user
          });
        }
        req.login(user, { session: false }, (error) => {
          if (error) {
            res.send(error);
          }
          let token = generateJWTToken(user.toJSON());
          return res.json({ user, token });
        });
      })(req, res);
    });
  }





















// Revisar capitulo para mas detalles. This is the code we'll use to create authorization in our endpoints 
// The code below first uses the the LocalStrategy you defined in the previous section to check that the username and password in the body of the request exist in the database. If they do, you use the