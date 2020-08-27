import React from "react";
//Routing
import axios from "axios";
import { Link } from "react-router-dom";

//Styling
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

export class ProfileView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null,
      email: null,
      birthday: null
      //   favoriteMovies: [],
      //   movies: []
    };
  }

  componentDidMount() {
    // console.log(this.props);
    //authentication
    const accessToken = localStorage.getItem("token");
    this.getUser(accessToken);
  }

  getUser(token) {
    const username = localStorage.getItem("user");

    axios
      .get(`https://scarpantonioapi.herokuapp.com/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      .then(res => {
        console.log(res);
        this.setState({
          Username: res.data.Username,
          Password: res.data.Password,
          Email: res.data.Email,
          Birthday: res.data.Birthday
          //   FavoriteMovies: res.data.FavoriteMovies
        });
      })
      .catch(function(err) {
        console.log("unable to get user data" + err);
      });
  }

  render() {
    // ** const { movies } = this.props;
    // const favoriteMovieList = movies.filter((movie) =>
    //   this.state.favoriteMovies.includes(movie._id)
    // );
    return (
      <div>
        <Container>
          <h1>My Profile</h1>
          <br />
          <Card>
            <Card.Body>
              <Card.Text>Username: {this.state.Username}</Card.Text>
              <Card.Text>Password: *******</Card.Text>
              <Card.Text>Email: {this.state.Email}</Card.Text>
              <Card.Text>Birthday {this.state.Birthday}</Card.Text>

              <br />
              <br />
              <Link to={"/profile/update"}>
                <Button variant="primary">Update Profile</Button>
                <br />
                <br />
              </Link>
              <Button onClick={() => this.handleUserDelete}>Delete User</Button>
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
