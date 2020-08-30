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
      birthday: null,
      // selectedMovie: null,
      favoriteMovies: []
      // movies: []
    };
  }
  // handleSelectedMovie(favMovie) {
  //   this.setState({
  //     selectedfavMovie: favMovie
  //   });
  //   console.log(favMovie);
  // }
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
          Birthday: res.data.Birthday,
          FavoriteMovies: res.data.FavoriteMovies
        });
      })
      .catch(function(err) {
        console.log("unable to get user data" + err);
      });
  }
  /** Por acomodar:
   *  #1 Tengo que tener una lista de todas als peliculas. las cuales pueda seleccionar con un click event.
   *  #2 Una vez seleccionada deberiamos actualziar el estado de la peli seleccionada con SelectedMovie.
   *  #3 Luego almacenamos ese nuevo estado en una variable const movie_id = this.state.selectedMovie_id;
   *  #4 Colocamos esa varaible en nuestro dinamic URL /${selectedMovie_id}`
   *  # Se puede colocar seleccion multiple, cambiamos selectedMovie state a un array[], selectedMovie[], para que pueda almacenar todas las selecciones de peliculas dentro del array, y luego cuando le demos a eliminar, tenemos que crear un nuevo route para que ese route pueda eliminar multiples. seria deleteMultiple. deleteMany para que pueda recibir y eliminar todas las peliculas seleccionadas.
   */
  handleFavMovieDelete() {
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const movie_id = this.state.selectedMovie;
    axios
      .delete(
        `https://scarpantonioapi.herokuapp.com/users/${username}/movies/${movie_id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
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
    // al pasar el movie como prop. obetenemos la pelicula indivudal, y luego buscamos cual es la pelicula que tenga ese id en especificio.
    const { movies } = this.props;
    const favoriteMovieList = movies.filter(movie =>
      this.state.favoriteMovies.includes(movie._id)
    );
    const favMovies = this.state.FavoriteMovies;
    // console.log(favoriteMovieList);
    // console.log(this.state.FavoriteMovies);
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
              <Card.Text>Username: {this.state.Username}</Card.Text>
              <Card.Text>Password: *******</Card.Text>
              <Card.Text>Email: {this.state.Email}</Card.Text>
              <Card.Text>Birthday {this.state.Birthday}</Card.Text>
              <Card.Text>Favorite Movies:</Card.Text>
              <ul>
                {(favMovies || []).map((fm, index) => (
                  <li key={index}>{movies.find(m => m._id === fm).Title}</li>
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
              <Button>Delete Favorite Movies</Button>
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
// {movies.map(movie => {
//   return (
//     <div>
//       <ul>
//         <li>{}</li>
//       </ul>
//     </div>
//   );
// })}
