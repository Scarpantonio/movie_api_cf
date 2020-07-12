import React from "react";
import axios from "axios";

import { MovieCard } from "../movie-card/movie-card";

export class MainView extends React.Component {
  // One of the "hooks" available in a React Component
  componentDidMount() {
    axios
      .get("https://scarpantonioapi.herokuapp.com/movies")
      .then(response => {
        // Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  render() {
    console.log(movies);
    const { movies } = this.state;
    if (!movies) return <div className="main-view" />;

    return (
      <div className="main-view">
        {movies.map(movie => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    );
  }
}
