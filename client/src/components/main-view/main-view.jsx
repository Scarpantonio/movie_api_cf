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

  // handle registered user para que se puedan mostar las peliculas
  registeredUser(registered) {
    this.setState({
      registered
    });
  }

  // Almacenamos la info localmente para q el usuario pueda tener acceso a los routes sin hacer login nuevamente.
  // De donde viene la data de authData? directamente de props.onLoggedIn(data); ese paramentro contiene un objeto. que luego desmenusamos authData.user.Username
  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });
    //almacenamos el token en el browser asi como el usuario. Con set item insertamos data localmente.
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    this.getMovies(authData.token);
  }

  getMovies(token) {
    axios
      .get("http://scarpantonioapi.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        // Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  handleRegisterBtn() {
    this.setState({
      user: true
    });
  }

  render() {
    const { movies, selectedMovie, user, registered } = this.state;

    // #1 esta condiciones se ejecutan en orden

    if (!user)
      return (
        <LoginView
          onLoggedIn={user => this.onLoggedIn(user)} // aqui pasamos la info del usuario a traves de props.
          handleRegisterBtn={() => this.handleRegisterBtn()}
        />
      );
    // cuando nuestro metodo registeredUser act state, se muestran movies.
    if (!registered)
      return (
        <RegisterView
          registeredUser={register => this.registeredUser(register)}
        />
      );

    if (!movies) return <div className="main-view" />;
    // cuando da click hacia atras selectedmovie es null, por eso pasa a movieCardd.
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
