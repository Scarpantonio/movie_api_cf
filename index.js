const express = require('express');
const app = express();
const morgan = require('morgan')

// Middleware
app.use(express.static('public'))
app.use(morgan('common'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

let favMovies = [
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling'
  },
  {
    title: 'Lord of the Rings',
    author: 'J.R.R. Tolkien'
  },
  {
    title: 'Twilight',
    author: 'Stephanie Meyer'
  },
  {
    title: 'La Mascara',
    author: 'Jim Carrey'
  },
  {
    title: 'Transformers',
    author: 'Jhon Smith'
  },
  {
    title: 'X-Man',
    author: 'Jay Tray'
  },
  {
    title: 'The invisible',
    author: 'Json Smith'
  },
  {
    title: 'The Impossible',
    author: 'Roy Kennedy'
  },
  {
    title: 'The Doors',
    author: 'Andrew Lopez'
  },
  {
    title: 'Steve Jobs',
    author: 'Steve Robinson'
  },
];

app.get('/', (req, res) => {
  res.send('Welcome to my movie API!');
});

app.get('/movies', (req, res) => {
  res.json(favMovies);
});

app.get('/documentation', (req, res) => {                  
  res.send('documentation')
});

// Server port
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
