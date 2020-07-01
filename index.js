const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const ejs = require('ejs')
const mongoose = require('mongoose');
const cors = require('cors');
const Models = require('./models.js');
const passport = require('passport');
require('./passport');
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('process.env.CONECTION_URI', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.json());
let auth = require('./auth')(app); // app so express is available in /auth. 
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(morgan('common'));
app.use(cors());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

let favMovies = [];

app.get('/', (req, res) => {
  res.send('Welcome to my movie API!');
});

// GET all movies
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(200).send(movies);  
  })
  .catch((err)=>{
    console.log(err)
    res.status(400).send('Error' + err)
  })
});

//  else {


// GET movie by title
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      if (!movie) {
        return res.status(400).send(req.body.movie + ' was not found');
      } else { res.json(movie); }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// GET movie by genre
app.get('/movies/genre/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.find({"Genre.Name": req.params.Name})
  .then((movie)=>{
    if(!movie){
      res.send(400).send(req.params.Name + ' was not found')
    } else {
      res.status(200).json(movie)
    }
  })
  .catch((err) => {
    console.log(err)
    res.status(400).send(err)
  })
});

//get directors info by their names
app.get('/Director/:Name', passport.authenticate('jwt', {session: false}), (req,res)=>{
  Movies.find({"Director.Name": req.params.Name})
  .then((Director)=>{
    if(!Director){
      res.send(400).send(req.params.Name + ' was not found')
    } else {
      res.status(200).json(Director)
    }
  })
  .catch((err) => {
    console.log(err)
    res.status(400).send(err)
  })
})

//delete movies by title
app.delete('/movies/:title', passport.authenticate('jwt', {session: false}), (req,res) => {
  Movies.findOneAndRemove({title:req.params.title})
  .then((movie)=>{
    if(!movie) {
      res.send(400).send(req.params.title + 'was not found')
    } else {
      res.status(200).send(req.params.title + ' was deleted')
    }
  })
  .catch((err)=>{
    console.log(err)
    res.status(400).send(err)
  })
})

//DELETE movie by id
app.delete('/movies/:_id', passport.authenticate('jwt', {session: false}), (req,res) => {
  Movies.findByIdAndDelete()({_id:req.params._id})
  .then((movie)=>{
    if(!movie) {
      res.send(400).send(req.params._id + 'was not found')
    } else {
      res.status(200).send(req.params._id + ' was deleted')
    }
  })
  .catch((err)=>{
    console.log(err)
    res.status(400).send(err)
  })
})

//Add new user : using mongoose
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users.create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get all users, here only admin should be able to do this. a new authenticate is necessary
app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Update user => por algua razon da null la repsuesta hay ver porque. 
app.put('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/Movies/:MovieID',passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//Delete user by name
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
  

// delete users favorite movies
app.delete('/users/:Username/Movies/:FavoriteMoviesID',passport.authenticate('jwt', {session: false}), (req, res) => {
  // primero encontamos al usuario/ update porque queremos cambiar info que ese user contiene. 
  Users.findOneAndUpdate({ Username : req.params.Username }, {
    //Luego indicamos con pull el array especifico que queremos eliminar. 
    $pull : { Favorit_movie : req.params.FavoriteMoviesID }
  },
  { new : true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser)
    }
  })
});

// API documentation
app.get('/documentation', passport.authenticate('jwt', {session: false}),(req, res) => {                  
  // res.sendFile(path.join(__dirname, '.public/documentation.html'));
  res.render('documentation')
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

// // Server port
// app.listen(8080, () => {
//   console.log('Your app is listening on port 8080.');
// });









//preguntar a jay como hacer con nested schemas/models

// //Add new movies 
// app.post('/movies/addMovies', (req, res) => {
//   Movies.findOne({ title: req.body.title })
//     .then((movie) => {
//       if (!movie) {
//         return res.status(400).send(req.body.title + 'already exists');
//       } else {

//         Movies.create({

//           title: req.body.title,
//           description: req.body.description,

//             genre: {
//               name:req.body.name,
//               description:req.body.description
//             },

//             Director: {
//               name:req.body.name,
//               bio:req.body.bio, 
//             },  

//           ImagePath: req.body.ImagePath,
//         featured: req.body.featured
//           })
//           .then((movie) =>{res.status(201).json(movie) })
//         .catch((error) => {
//           console.error(error);
//           res.status(500).send('Error: ' + error);
//         })
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//       res.status(500).send('Error: ' + error);
//     });
// });


// add new user
// app.post('/user', (req, res) => {
//   let newUser = req.body;
//   // res.send("create new user route") 
//   if(!newUser.name) {
//     const errMessage = 'Username is required'
//     res.status(400).send(errMessage);
//   } else {
//     newUser.id = uuid.v4();
//     user.push(newUser);
//     res.status(201).send(newUser);
//   }
// });

// delete favorite movies 
// app.delete('/user/favoriteMovies/delete', (req, res) => {
//   // res.send("delete fav user movies route") 
//   let deleteMovie = req.body;
//   if(!deleteMovie.title) {
//     const errMessage = 'there is no movies to delete'
//     res.status(400).send(errMessage);
//   } else {
//     favMovies.filter(deleteMovie);
//     res.status(201).send(deleteMovie);
//   }
// });

// update user
// app.put('/user/update', (req, res) => {
//   res.send("update user route") 
// });

// // delete user
// app.delete('/user/delete/:id', (req, res) => {
//   res.send("delete user route") 
// });

// // Add favorite movie by user 
// app.post('/user/favoriteMovies', (req, res) => {
//   res.send("favorite movie route") 
// });
