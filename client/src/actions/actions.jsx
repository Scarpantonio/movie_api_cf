// In the file itself, you're explicitly naming your potential actions. SET_MOVIES initializes the movies list with movies; SET_FILTER sets the filter to, well, filter your movies list. The reason for exporting functions is convenience: you'll be able to call them from wherever you want to perform said actions. Think of these functions like event constructors: you'll call them from a view to formally express the change you want to perform on the application's state.
// maintaining the user login info in the store.

// This is what we listen to in our reducers later.
export const SET_MOVIES = "SET_MOVIES";
export const SET_FILTER = "SET_FILTER";
export const SET_USER_PROFILE = "SET_USER_PROFILE";
export const SET_USER_FAV_MOVIE = "SET_USER_FAV_MOVIE";
export const SET_LOGGED_IN_USER = "SET_LOGGED_IN_USER";

// ! ! ! !HOW DO WE ACTUALLY TAKE THE STATE FROM THE INDIVIDUAL COMPONENT. userProfile and geMovies
// The value we are passing to set movies, is the response coming from getMovies() this seems is how we tak the state out of the private state of that individual component.

export function setMovies(value) {
  return { type: SET_MOVIES, value };
}

export function setFilter(value) {
  return { type: SET_FILTER, value };
}

// this value is going to get the userprofile in order to store the New state in the store
export function setUserProfile(value) {
  return { type: SET_USER_PROFILE, value };
}

export function setLoggedInUser(value) {
  return { type: SET_LOGGED_IN_USER, value };
}

export function setUserFavoriteMovie(value) {
  return { type: SET_USER_FAV_MOVIE, value };
}
