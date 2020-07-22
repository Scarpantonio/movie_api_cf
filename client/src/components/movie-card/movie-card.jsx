import React from "react";

export class MovieCard extends React.Component {
  render() {
    // This is given to the <MovieCard/> component by the outer world which, in this case, is `MainView`, as `MainView` is what’s connected to your database via the movies endpoint of your API
    // Aqui obtenemos la info desde main-view que tiene axios call hacia nuestro API. acedemos a el con const movie = this.props.movies  y luego simplemente le hacemos renderisamos la info que contiene nuestra base de datos.

    const { movie, onClick } = this.props;

    return (
      // este es el click que cambia el estado de main-view to movie-view: The MovieCard now has an onClick prop that changes the MainView's state. This is a perfect example of how React works: clicking on a MovieCard changes the MainView's state, which triggers a rendering cycle that'll return something different: the MovieView., When a user clicks on a card, the onClick() method of the parent component (MainView) is called. The onClick() method from MainView updates the state of selectedMovie, and, as a result, the render() method of the MainView component is called, and the conditional rendering takes care of displaying the selected movie
      <div onClick={() => onClick(movie)} className="movie-card">
        {movie.Title}
      </div>
    );
  }
}
