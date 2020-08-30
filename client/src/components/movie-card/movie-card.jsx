import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export class MovieCard extends React.Component {
  constructor() {
    super();

    this.state = {
      addFavMovBtn: "add to favorites",
      selectedMovie: null
    };
  }

  /**
   * Problemas
   * Cuando agregamos una nueva pelicula y le damos hacia atras. El estado se reinicia y podemos agregar mil veces la misma pelicula. crear logica para que no se puede repetir dos veces la misma pelicula.
   * La posible solucion es que debemos mandar el maanejo del estado en el main view.
   * Crear logica para eliminar pelicula.
   *
   */

  handleAddFavMovie = movieId => {
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const movie_id = movieId;

    axios
      .post(
        `https://scarpantonioapi.herokuapp.com/users/${username}/Movies/${movie_id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        console.log(res);
        console.log(movieId);
        this.setState({
          addFavMovBtn: "You loved it",
          selectedMovie: movieId
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  debugger;
  render() {
    const { movie } = this.props;
    const { addFavMovBtn } = this.state;
    return (
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
              {addFavMovBtn}
            </Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }
}

// // MovieCard.propTypes = {
// //   movie: PropTypes.shape({
// //     Title: PropTypes.string.isRequired,
// //     Description: PropTypes.string.isRequired,
// //     ImagePath: PropTypes.string.isRequired
// //   }).isRequired,
// //   onClick: PropTypes.func.isRequired
// // };
