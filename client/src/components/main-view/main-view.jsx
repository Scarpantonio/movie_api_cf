// problems. when a user logouts,  I can't acces because of the funcion (!favmovies) and then when I login I can get access to the whole thing because that function is active again or viserbersa

import React from "react";
import axios from "axios";
import { LoginView } from "../login-view/login-view";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { RegisterView } from "../reg-view/reg-view";
import { GenreView } from "../genre-view/genre-view";
import { DirectorView } from "../director-view/director-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { ProfileView } from "../profile-view/profile-view";
import { UpdateUserView } from "../updateuser-view/updateuser-view";
import { AboutView } from "../about-view/about-view";
import { ContactView } from "../contact-view/contact-view";
import Button from "react-bootstrap/Button";

export class MainView extends React.Component {
  constructor() {
    super();
    // porque movies es un array
    this.state = {
      movies: [],
      user: null,
      userProfile: null,
      addFavMovBtn: "I loved it",
      userProfile: null
    };
  }

  // abajo en include, en vez de colocar favMovies. vamos a buscar a travez del objeto.  por ejemplo: userProfile.Favmovies -

  getUser(token) {
    const username = localStorage.getItem("user");
    axios
      .get(`https://scarpantonioapi.herokuapp.com/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        this.setState({
          userProfile: res.data
        });
      })
      .catch(function(err) {
        console.log("unable to get user data" + err);
      });
  }

  // 1# Este token viene de componentDidmount, es asi como tenemos acceso al token que esta almacenado en LocalStorage
  // 2# Aqui solo le pasamos el token a nuestro express route, para asi lograr actualizar el estado de movies con la informacion actual de las movies.
  getMovies(token) {
    axios
      .get("https://scarpantonioapi.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        // queriamos asignar a favorite algo como, userprofile.Favmovies  -- abajo en added donde solo creamos tenemos FavoriteMovies
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
      this.getUser(accessToken);
    }
  }
  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    this.getMovies(authData.token);
    // this.handleUserDelete(authData.token);
  }

  onLoggedOut() {
    alert("You have been logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState({
      user: null
    });
    window.open("/", "_self");
  }

  updateUser(token) {
    const username = localStorage.getItem("user");
    axios
      .delete(`https://scarpantonioapi.herokuapp.com/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        console.log(res);
        console.log("user deleted");
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    // xq colocamos match en routes abajo = Es match porque accedemos al objeto enviado por routes como props.
    const { movies, user, FavoriteMovies, userProfile } = this.state;

    // if (!movies) return <div className="main-view" />;

    // if (!FavoriteMovies) {
    //   return null;
    // }

    // console.log(FavoriteMovies);
    // if (!movies) {
    //   return null;
    // }

    return (
      <Router>
        {!user ? (
          <div></div>
        ) : (
          <div>
            <Button onClick={() => this.onLoggedOut()}>Logout</Button>
          </div>
        )}

        <div className="main-view">
          <Route
            exact
            path="/"
            render={() => {
              if (!user)
                return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
              // return <MovieCard movies={movies} />;
              return movies.map(m => (
                <MovieCard
                  key={m._id}
                  movie={m}
                  // favMovbtn={this.addFavMovBtn}
                  // added={FavoriteMovies.includes(m._id)}
                />
              ));
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
            path="/directors/:name"
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
            path="/genres/:name"
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
            path="/profile"
            render={() => (
              <ProfileView
                // handleUserDelete={this.handleUserDelete()}
                movies={movies}
                userProfile={userProfile}
              />
            )}
          />
          <Route path="/profile/update" component={UpdateUserView} />
          <Route path="/about" component={AboutView} />
          <Route path="/contact" component={ContactView} />
        </div>
      </Router>
    );
  }
}
