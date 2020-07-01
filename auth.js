const jwtSecret = 'secrets-are-a-good-things'; 

const jwt = require('jsonwebtoken'),
      passport = require('passport');

require('./passport'); 

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, 
    expiresIn: '7d', 
    algorithm: 'HS256' 
  });
}

/* POST login. */
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