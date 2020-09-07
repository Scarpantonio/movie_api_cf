// problems. when a user logouts,  I can't acces because of the funcion (!favmovies) and then when I login I can get access to the whole thing because that function is active again or viserbersa
// user must have a favorite movie before updateing user information if not, then when we try to get fav movies from user the code gets stock.

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
      addFavMovBtn: "I loved it",
      userProfile: null,
      favoriteMovies: null
    };
  }

  // abajo en include, en vez de colocar favMovies. vamos a buscar a travez del objeto.  por ejemplo: userProfile.Favmovies -
  //AQUI TAMBINE DEBEMOS AGRAGAR LA FUNCION PARA UPDATE USER.

  getUser(token) {
    const username = localStorage.getItem("user");
    axios
      .get(`https://scarpantonioapi.herokuapp.com/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        this.setState({
          userProfile: response.data,
          favoriteMovies: response.data.FavoriteMovies
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
    const {
      movies,
      user,
      userProfile,
      favoriteMovies,
      addFavMovBtn
    } = this.state;

    if (!movies) return <div className="main-view" />;

    // create conditional here to !user? not apply this function. so we can login propertly.

    // const errFvMovies = () => {
    //   if (!favoriteMovies) {
    //     return null;
    //   }
    // };

    // !user ? null : errFvMovies();

    if (!favoriteMovies) {
      return null;
    }

    if (!FavoriteMovies) {
      return null;
    }

    // {!user ? null : (
    //   <div>
    //     <Button onClick={() => this.onLoggedOut()}>Logout</Button>
    //   </div>
    // )}

    return (
      <Router>
        {!user ? null : (
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
                  favMovbtn={addFavMovBtn}
                  added={favoriteMovies.includes(m._id)}
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
                movies={movies}
                userProfile={userProfile}
                favoriteMovies={favoriteMovies}
              />
            )}
          />

          <Route
            exact
            path="/profile/update"
            render={() => <UpdateUserView userProfile={userProfile} />}
          />

          <Route path="/about" component={AboutView} />
          <Route path="/contact" component={ContactView} />
        </div>
      </Router>
    );
  }
}
