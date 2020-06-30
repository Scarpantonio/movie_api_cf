const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let movieSchema = mongoose.Schema ({
    title: {
        type:String, 
        required:true
    },
    description: {
        type:String,
        required:true
    },
    genre:{
        name:String,
        description:String
    },
    Director: {
        Name: String,
        Bio: String
      },
      Actors: [String],
      ImagePath: String,
      Featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });

  // The first function you’ll want to add is a hashPassword function, which is what does the actual hashing of submitted passwords.
  userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };
  
  //The second function, validatePassword, is what compares submitted hashed passwords with the hashed passwords stored in your database.
  userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };
  
  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);
  
  module.exports.Movie = Movie;
  module.exports.User = User;