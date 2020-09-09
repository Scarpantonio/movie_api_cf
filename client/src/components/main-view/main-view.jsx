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
    this.state = {
      movies: [],
      user: null,
      addFavMovBtn: "I loved it",
      userProfile: null,
      favoriteMovies: null
    };
  }

  getMovies(token) {
    axios
      .get("https://scarpantonioapi.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        this.setState({
          movies: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

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
    this.setState({
      user: authData.user.Username
    });
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    // we get the token here to pass it to the functions that retrieve the data we need for the other pages.
    this.getMovies(authData.token);
    this.getUser(authData.token);
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
              if (!favoriteMovies) {
                return null;
              }
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
            render={() => (
              <UpdateUserView
                userProfile={userProfile}
                onLoggedIn={user => this.onLoggedIn(user)}
              />
            )}
          />

          <Route path="/about" component={AboutView} />
          <Route path="/contact" component={ContactView} />
        </div>
      </Router>
    );
  }
}
