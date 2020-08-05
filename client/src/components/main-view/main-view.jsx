// @flow

import React from "react";
import axios from "axios";
import { LoginView } from "../login-view/login-view";
import { RegisterView } from "../reg-view/reg-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
// import { ErrorBoundry } from "../error-boundary/error-boundary";

export class MainView extends React.Component {
  constructor() {
    super();

    this.state = {
      movies: null,
      selectedMovie: null,
      user: null,
      registered: null
    };
  }

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

  handleBackBtn() {
    this.setState({
      selectedMovie: null
    });
  }

  onLoggedIn(user) {
    this.setState({
      user
    });
  }

  registeredUser(registered) {
    this.setState({
      registered
    });
  }

  render() {
    const { movies, selectedMovie, user, registered } = this.state;

    // #1 esta condiciones se ejecutan en orden
    if (!registered)
      return (
        <RegisterView
          registeredUser={registered => this.registeredUser(registered)}
        />
      );

    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

    if (!movies) return <div className="main-view" />;

    return (
      <div className="main-view">
        {selectedMovie ? (
          <MovieView
            handleBackClick={() => this.handleBackBtn()}
            movie={selectedMovie}
          />
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

// Como funciona onMovieCLick => selecciona movie. se lo pasamos a la funcion y luego esa peli seleccionada se pasa a travez de props a moviecard, y luego en moviecard mostramos con movie.title etc. la info de la seleccionada.
