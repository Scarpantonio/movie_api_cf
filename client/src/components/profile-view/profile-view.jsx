import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import "./profile-view";
import {
  setMovies,
  setUserProfile,
  setUserFavoriteMovie,
  setLoggedInUser
} from "../../actions/actions";

// read again how movielist got movies pass as props, and why we algo pass it as a state. we have to pass favorite movies here. So when we go tu the page is updated withouth being refresh, or ask to jay what happen.
// movieList explica como -  explica paso a paso como accedemos a movies que esta almacenado en store.- al estado. Capas y ya no necesitamos pasar el estado desde nuestro main component incluso cuando agarramos el estadod esde alli?

// const mapStateToProps = state => ({
//   const { userFavoriteMovies } = state;
//   return { userFavoriteMovies };
// });

export class ProfileView extends React.Component {
  state = {
    selectedMovie: null
  };
  componentDidMount() {
    const accessToken = localStorage.getItem("token");
  }

  handleFavMovieDelete = movie => {
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    // const movie_id = this.state.selectedMovie;
    axios
      .delete(
        `https://scarpantonioapi.herokuapp.com/users/${username}/movies/${movie}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        window.open("/profile", "_self");
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handleUserDelete() {
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    axios
      .delete(`https://scarpantonioapi.herokuapp.com/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        console.log(res);
        console.log("user deleted");
        alert("your account has been deleted");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.open("/", "_self");
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    const { userProfile, movies, favoriteMovies } = this.props;

    if (!userProfile) return null;

    const favMovies = this.props.favoriteMovies;
    if (!movies || movies.length === 0) {
      return null;
    }

    return (
      <div>
        <Container>
          <h1>My Profile</h1>
          <br />
          <Card>
            <Card.Body>
              <Card.Text>Username: {userProfile.Username}</Card.Text>
              <Card.Text>Password: *******</Card.Text>
              <Card.Text>Email: {userProfile.Email}</Card.Text>
              <Card.Text>Birthday {userProfile.Birthday}</Card.Text>

              <Card.Text>Favorite Movies:</Card.Text>

              <ul>
                {(favMovies || []).map((fm, index) => (
                  <div>
                    <li key={index}>
                      {movies.find(m => m._id === fm).Title}
                      <button
                        className="btn"
                        to={"/profile"}
                        onClick={() => this.handleFavMovieDelete(fm)}
                      >
                        Delete
                      </button>
                    </li>
                    <span></span>
                  </div>
                ))}
              </ul>

              <br />
              <br />
              <Link to={"/profile/update"}>
                <Button variant="primary">Update Profile</Button>
                <br />
                <br />
              </Link>
              <Button onClick={this.handleUserDelete}>Delete User</Button>
              <br />
              <br />
              <Link to={`/`}>Back</Link>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }
}

// export default connect(mapStateToProps)(ProfileView);

ProfileView.propTypes = {
  userProfile: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthday: PropTypes.number.isRequired,
    favoriteMovies: PropTypes.shape({
      FavoriteMovies: PropTypes.string.isRequired
    }),
    movies: PropTypes.shape({
      Title: PropTypes.string.isRequired
    })
  }).isRequired
};
