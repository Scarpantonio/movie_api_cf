import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import "./login-view.scss";
import axios from "axios";

export function LoginView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //When a user clicks on the submit button, you need to update your handleSubmit method, where you’ll make a POST request to the login endpoint using axios. The server-side should then check the user’s login details against what’s stored in the database of authenticated users. If there’s no match, the server throws an error back to the user.If there’s a match, the server generates a token for the logged in user and sends it back with the response. Go ahead and update your code with what’s been explained so far:

  const handleSubmit = e => {
    e.preventDefault();
    /* Send a request to the server for authentication */
    axios
      .post("https://scarpantonioapi.herokuapp.com/login", {
        Username: username,
        Password: password
      })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch(e => {
        console.log("user not found");
      });
  };

  const handleViewBtn = e => {
    e.preventDefault();
    props.handleRegisterBtn();
  };

  return (
    <Container className="formStyle">
      <h2 className="r-title">Log In</h2>
      <Form className="inputStyles">
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username </Form.Label>
          <Form.Control
            size="md"
            placeholder="Enter username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Row controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            size="md"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Row>

        <Button
          className="S-Btn"
          variant="primary"
          type="submit"
          onClick={handleSubmit}
        >
          Submit
        </Button>

        <Button variant="link" className="newUserLink" onClick={handleViewBtn}>
          New user? register here
        </Button>
      </Form>
    </Container>
  );
}

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
  handleRegisterBtn: PropTypes.func.isRequired
};
