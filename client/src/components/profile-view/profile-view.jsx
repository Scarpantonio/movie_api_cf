import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import "./profile-view";

export class ProfileView extends React.Component {
  state = {
    selectedMovie: null
  };
  componentDidMount() {
    // console.log(this.props);
    //authentication
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
        console.log("Favorite movie has been removed");
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