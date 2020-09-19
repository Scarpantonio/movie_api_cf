// src/reducers/reducers.js
import { combineReducers } from "redux";

import {
  SET_FILTER,
  SET_MOVIES,
  SET_USER_PROFILE,
  SET_USER_FAV_MOVIE,
  SET_LOGGED_IN_USER
} from "../actions/actions";

function visibilityFilter(state = "", action) {
  switch (action.type) {
    case SET_FILTER:
      return action.value;
    default:
      return state;
  }
}

function movies(state = [], action) {
  switch (action.type) {
    case SET_MOVIES:
      return action.value;
    default:
      return state;
  }
}

// Mision is to return a new state based on the action. in the action we have the api call that will get the info dispached to store ...
function userProfile(state = [], action) {
  switch (action.type) {
    case SET_USER_PROFILE:
      return action.value;
    default:
      return state;
  }
}

// Para centralizar user, recordar crear la accionó y el reducer de la misma manera // user: this.props.setUSer(authData.user.Username) para poder pedirle al reducer que guarde nuestro estado en el principal.

function userFavoriteMovies(state = [], action) {
  switch (action.type) {
    case SET_USER_FAV_MOVIE:
      return action.value;
    default:
      return state;
  }
}

function userLoogedIn(state = [], action) {
  switch (action.type) {
    case SET_LOGGED_IN_USER:
      return action.value;
    default:
      return state;
  }
}

// exported to index.jsx to create the store. with this all the reducers are configured to provide order.
// macking the data reducers get accesiblein the store. "volver a leer lo que dice combineReducers"
const moviesApp = combineReducers({
  visibilityFilter,
  movies,
  userProfile,
  userFavoriteMovies,
  userLoogedIn
});

export default moviesApp;
