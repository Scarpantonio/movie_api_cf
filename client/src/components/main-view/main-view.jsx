import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { LoginView } from "../login-view/login-view";
import { RegisterView } from "../reg-view/reg-view";
import { GenreView } from "../genre-view/genre-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import Button from "react-bootstrap/Button";

export class MainView extends React.Component {
  constructor() {
    super();

    this.state = {
      movies: [],
      user: null
    };
  }

  getGenres(token) {
    axios
      .get(
        `https://scarpantonioapi.herokuapp.com/movies/genres/${movie.Genre.Name}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then(response => {
        this.setState({
          movies: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  getMovies(token) {
    axios
      .get("https://scarpantonioapi.herokuapp.com/movies", {
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

  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem("user")
      });
      this.getMovies(accessToken);
      this.getGenres(accessToken);
    }
    //api call
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

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username,
      registered: true
    });
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    this.getMovies(authData.token);
    this.getGenres(authData.token);
  }

  // logOut user
  onLoggedOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // pasamos el esta de user a null. para q nos lleve a login again.
    this.setState({
      user: null
    });
  }

  render() {
    const { movies, user } = this.state;

    if (!movies) return <div className="main-view" />;

    return (
      <Router>
        <div className="main-view">
          <Route
            exact
            path="/"
            render={() => {
              if (!user)
                return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
              return movies.map(m => <MovieCard key={m._id} movie={m} />);
            }}
          />

          <Route path="/register" render={() => <RegisterView />} />

          <Route
            path="/movies/:movieId"
            render={({ match }) => (
              <MovieView
                movie={movies.find(m => m._id === match.params.movieId)}
              />
            )}
          />
          <Route
            path="/movies/director/:name"
            render={({ match }) => {
              if (!movies) return <div className="main-view" />;
              return (
                <DirectorView
                  director={
                    movies.find(m => m.Director.Name === match.params.name)
                      .Director
                  }
                />
              );
            }}
          />
          <Route
            path="/movies/genres/:name"
            render={({ match }) => {
              if (!movies) return <div className="main-view" />;
              return (
                <GenreView
                  genre={
                    movies.find(m => m.Genre.Name === match.params.name).Genre
                  }
                />
              );
            }}
          />
          <Route
            exact
            path="/user"
            render={() => <ProfileView movies={movies} />}
          />
        </div>
      </Router>
    );
  }
}
