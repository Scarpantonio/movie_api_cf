const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const ejs = require('ejs')

// Middleware
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(morgan('common'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

let favMovies = [];

let user = [
  {
   name:"Eduardo",
  }
];

let movies = [
  {
    title: 'Harry Potter',
    description:"Harry Potter is an orphaned boy brought up by his unkind Muggle (non-magical) aunt and uncle. ... Harry became extremely famous in the Wizarding World as a result. Harry begins his first year at Hogwarts School of Witchcraft and Wizardry and learns about magic.",
    director: 'J.K. Rowling',
    genre: 'fantasy',
    featured: true,
  },
  {
    title: 'Lord of the Rings',
    description:"The Lord of the Rings is the saga of a group of sometimes reluctant heroes who set forth to save their world from consummate evil. Its many worlds and creatures were drawn from Tolkien's extensive knowledge of philology and folklore.",
    director: 'Peter Jackson',
    genre: 'fantasy',
    featured: true,
  },
  {
    title: 'Transformers',
    description:"Synopsis. The movie opens with Optimus Prime, an Autobot, narrating the history of the AllSpark, a cube-shaped artifact capable of granting independent life to normal electronic and mechanical objects, which is the source of life for all Transformers, both Autobots and the evil Decepticons.",
    director: 'Michael Bay',
    genre: 'fantasy',
    featured: true,
  }
];

app.get('/', (req, res) => {
  res.send('Welcome to my movie API!');
});

// get a list of all movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

// get movie by title
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movieTitle) =>
    { return movieTitle.title === req.params.title }));
});

// ** get movie by genre
app.get('/movies/genre/:genre', (req, res) => {
  res.json(movies.filter((movieGenre) =>
    { return movieGenre.genre === req.params.genre }));
});

// get director info by name
app.get('/movies/director/:director', (req, res) => {
  res.json(movies.find((movieDirector) =>
    { return movieDirector.director === req.params.director }));
});

// add new user
app.post('/user', (req, res) => {
  let newUser = req.body;
  // res.send("create new user route") 
  if(!newUser.name) {
    const errMessage = 'Username is required'
    res.status(400).send(errMessage);
  } else {
    newUser.id = uuid.v4();
    user.push(newUser);
    res.status(201).send(newUser);
  }
});

// update user
app.put('/user/update', (req, res) => {
  res.send("update user route") 
});

// delete user
app.delete('/user/delete/:id', (req, res) => {
  res.send("delete user route") 
});

// Add favorite movie by user 
app.post('/user/favoriteMovies', (req, res) => {
  res.send("favorite movie route") 
});

// delete favorite movies 
app.delete('/user/favoriteMovies/delete', (req, res) => {
  // res.send("delete fav user movies route") 
  let deleteMovie = req.body;
  if(!deleteMovie.title) {
    const errMessage = 'there is no movies to delete'
    res.status(400).send(errMessage);
  } else {
    favMovies.filter(deleteMovie);
    res.status(201).send(deleteMovie);
  }
});

// API instructions
app.get('/documentation', (req, res) => {                  
  // res.sendFile(path.join(__dirname, '.public/documentation.html'));
  res.render('documentation')
});

// Server port
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
