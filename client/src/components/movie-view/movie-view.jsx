import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";

export class MovieView extends React.Component {
  constructor() {
    super();
  }

  render() {
    const { movie, handleBackClick } = this.props;
    if (!movie) return null;

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
<<<<<<< HEAD
          <Link to={`/genres/${movie.Genre.Name}`}>
            <Button variant="link">more info</Button>
          </Link>
=======
>>>>>>> e8ac81a6d63188f3db2b527672d7d5c4e4629c56
        </div>
        <div className="movie-director">
          <span className="label">Director: </span>
          <span className="value">{movie.Director.Name}</span>
<<<<<<< HEAD
          <Link to={`/directors/${movie.Director.Name}`}>
            <Button variant="link">more info</Button>
          </Link>
=======
>>>>>>> e8ac81a6d63188f3db2b527672d7d5c4e4629c56
        </div>
        <Button onClick={handleBackClick}>back</Button>
      </div>
    );
  }
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired
    }),
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired
    })
  }).isRequired
};
