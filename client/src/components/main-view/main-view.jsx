import React from "react";
import axios from "axios";

import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export class MainView extends React.Component {
  constructor() {
    super();

    this.state = {
      movies: null,
      selectedMovie: null
    };
  }

  // We run this before is maunted: Why would you want to add code right after a component is mounted? Well, this is a good place to perform async tasks such as making ajax requests or adding event listeners.
  componentDidMount() {
    axios
      .get("https://scarpantonioapi.herokuapp.com/movies")
      .then(response => {
        // Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  render() {
    const { movies, selectedMovie } = this.state;

    // Before the movies have been loaded
    if (!movies) return <div className="main-view" />;

    // selectedMovie? open MovieView notSelected? open the list of movies. // no movies selected? we show list intead.
    return (
      <div className="main-view">
        {selectedMovie ? (
          <MovieView movie={selectedMovie} />
        ) : (
          movies.map(movie => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onClick={movie => this.onMovieClick(movie)}
            />
          ))
        )}
      </div>
    );
  }
}
