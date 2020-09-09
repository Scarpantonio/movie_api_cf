import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import "./login-view.scss";
import axios from "axios";
import { Link } from "react-router-dom";

export function LoginView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
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

  return (
    <Container className="formStyle">
      <h2 className="r-title">Log In</h2>
      <Form className="inputStyles">
        <Form.Group>
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

        <Link to={`/register`}>
          <Button variant="link" className="newUserLink" type="submit">
            new user? register
          </Button>
        </Link>
      </Form>
    </Container>
  );
}
