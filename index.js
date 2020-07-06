const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Models = require("./models");
const Movies = Models.Movie;
const Users = Models.User;
const { check, validationResult } = require("express-validator");
uuid = require("uuid");
const cors = require("cors");
const passport = require("passport");
require("./passport");

app.use(cors());
app.use(morgan("common"));
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.json());

let auth = require('./auth')(app);

// mongoose.connect("mongodb://localhost:27017/myFlixDB", { useNewUrlParser: true, useUnifiedTopology: true }).catch(error => handleError(error));

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true})

app.get('/', (req, res) => {
  res.send('Welcome to the myFlix app!');
});

app.get('/documentation', (req, res) => {
  res.render('documentation');
});

// List all movies
app.get('/movies', 
// passport.authenticate("jwt", { session: false }),
(req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Data on individual movie
app.get('/movies/:Title', passport.authenticate("jwt", { session: false }),
(req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

 // Data on genres
app.get('/movies/genres/:Name', passport.authenticate("jwt", { session: false }),
(req, res) => {
  Movies.findOne({ "Genre.Name": req.params.Name })
    .then((movie) => {
      res.status(201).json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

 // Data on a specific director
app.get('/movies/directors/:Name', passport.authenticate("jwt", { session: false }),
(req, res) => {
  Movies.findOne({ "Director.Name": req.params.Name })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//List all users
app.get('/users', passport.authenticate("jwt", { session: false }),
(req, res) => {
  Users.find()
  .then(function(users) {
    res.status(201).json(users)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Add user
app.post('/users', 
[ check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail() ],
(req, res) => {
  let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  // let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            // hashedPassword
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user)})
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

// Update a user's info, by username
app.put('/users/:Username', (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, 
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Delete a user by username
app.delete('/users/:Username', passport.authenticate("jwt", { session: false }),
(req, res) => {
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

//Add a favorite movie 
app.post(
  "/users/:Username/Movies/:MovieID", passport.authenticate("jwt", { session: false }),
  (req, res) => {  
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $push: { FavoriteMovies: req.params.MovieID } },
    { new: true }, 
    (error, updatedUser) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error: " + error);
      } else {
        res.json(updatedUser);
      }
    });
  }
);

//Remove a favorite movie 
app.delete(
  "/users/:Username/Movies/:MovieID", passport.authenticate("jwt", { session: false }),
  (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true }, // This line makes sure that the updated document is returned
    (error, updatedUser) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error: " + error);
      } else {
        res.json(updatedUser);
      }
    });
  }
);
 
// required use after all middleware and route calls
app.use((err, req, res, next) => {
  // console.error(req);
  // console.error(res);
  console.error(err.stack);
  res.status(500).send('something broke');
 });

var port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port 8080");
});

// Server port
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
