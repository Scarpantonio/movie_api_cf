import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

export class MovieView extends React.Component {
  constructor() {
    super();
  }

  render() {
    const { movie } = this.props;
    if (!movie) return null;
    console.log(this.props);
    return (
      <div className="main-view">
        <img className="movie-poster" src={movie.ImagePath} />
        <div className="movie-title">
          <span className="label">Title: </span>
          <span className="value">{movie.Title}</span>
        </div>
        <div className="movie-description">
          <span className="label">Description: </span>
          <span className="value">{movie.Description}</span>
        </div>

        <div className="movie-genre">
          <span className="label">Genre: </span>
          <span className="value">{movie.Genre.Name}</span>
          <Link to={`/genres/${movie.Genre.Name}`}>
            <Button variant="link">more info</Button>
          </Link>
        </div>
        <div className="movie-director">
          <span className="label">Director: </span>
          <span className="value">{movie.Director.Name}</span>
          <Link to={`/directors/${movie.Director.Name}`}>
            <Button variant="link">more info</Button>
          </Link>
        </div>
        <Link to={"/"}>
          <Button variant="link">Back</Button>
        </Link>
      </div>
    );
  }
}

// MovieView.propTypes = {
//   movie: PropTypes.shape({
//     Title: PropTypes.string.isRequired,
//     Description: PropTypes.string.isRequired,
//     ImagePath: PropTypes.string.isRequired,
//     Genre: PropTypes.shape({
//       Name: PropTypes.string.isRequired
//     }),
//     Director: PropTypes.shape({
//       Name: PropTypes.string.isRequired
//     })
//   }).isRequired
// };
