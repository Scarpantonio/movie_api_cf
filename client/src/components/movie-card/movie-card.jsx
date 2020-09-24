// aqui deberiamos agregar lalogica de redux, para cuando se le click al boton, lo envie a redux. o el estado quede almacenado en el redux store.
// You need to call this method on the button handling: setUserFavoriteMovie

import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import { Card, CardDeck } from "react-bootstrap";
import { setUserFavoriteMovie } from "../../actions/actions";
import { connect } from "react-redux";

import { Link } from "react-router-dom";
export class MovieCard extends React.Component {
  constructor() {
    super();
    this.state = {
      addFavMovBtn: "add to favorites",
      selectedMovie: null
    };
  }

  handleAddFavMovie = movieId => {
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const movie_id = movieId;
    axios
      .post(
        `https://scarpantonioapi.herokuapp.com/users/${username}/Movies/${movie_id}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        this.setState({
          addFavMovBtn: "You loved it",
          selectedMovie: movieId
        });
        this.props.setUserFavoriteMovie(res.data.FavoriteMovies);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    // console.log(this.props.setUserFavoriteMovie);
    const { movie, added } = this.props;
    const { addFavMovBtn } = this.state;
    return (
      <CardDeck style={{ width: "45rem" }}>
        <Card style={{ width: "16rem" }}>
          <Card.Img variant="top" src={movie.ImagePath} />
          <Card.Body>
            <Card.Title>{movie.Title}</Card.Title>
            <Card.Text>{movie.Description}</Card.Text>
            <Link to={`/movies/${movie._id}`}>
              <Button variant="link">Open</Button>
            </Link>
            <Link to={``}>
              <Button
                onClick={() => this.handleAddFavMovie(movie._id)}
                variant="link"
              >
                {!added && addFavMovBtn}
              </Button>
            </Link>
            <span>{added && "already added"}</span>
          </Card.Body>
        </Card>
      </CardDeck>
    );
  }
}

// let mapStateToProps = state => {
//   return {
//     favoriteMovies: state.userFavoriteMovies
//   };
// };

// export default connect(mapStateToProps, {
//   setUserFavoriteMovie
// })(MovieCard);

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Description: PropTypes.string.isRequired
    }).isRequired,
    added: PropTypes.bool
  }).isRequired
};
