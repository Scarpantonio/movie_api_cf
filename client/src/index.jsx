import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { devToolsEnhancer } from "redux-devtools-extension";

import MainView from "./components/main-view/main-view.jsx";
import moviesApp from "./reducers/reducers";

// Import statement to indicate that you need to bundle `./index.scss`
import "./index.scss";

// creating the store in our Rapp
const store = createStore(moviesApp, devToolsEnhancer({ trace: true }));

// Main component (will eventually use all the others)
class MyFlixApplication extends React.Component {
  render() {
    return (
      <div className="main">
        <Provider store={store}>
          <MainView />
        </Provider>
      </div>
    );
  }
}

// Finds the root of your app
const container = document.getElementsByClassName("app-container")[0];

// Tells React to render your app in the root DOM element
ReactDOM.render(React.createElement(MyFlixApplication), container);
