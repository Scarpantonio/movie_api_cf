import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import PropTypes from "prop-types";
import "./reg-styles.scss";
import axios from "axios";

export function RegisterView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = e => {
    e.preventDefault();

    axios
      .post("https://scarpantonioapi.herokuapp.com/users", {
        Username: username,
        Password: password,
        Email: email,
        Birthday: birthday
      })
      .then(response => {
        const data = response.data;
        alert("Your account has been created! Please login");
        console.log(data);
        window.open("/", "_self");
      })
      .catch(e => {
        console.log("error registering the user");
      });
  };

  return (
    <Container className="formStyle">
      <h2 className="r-title">New User</h2>
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

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email </Form.Label>
          <Form.Control
            size="md"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Password </Form.Label>
          <Form.Control
            size="md"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Birthday</Form.Label>
          <Form.Control
            size="md"
            type="date"
            placeholder="12/31/1990"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
          />
        </Form.Group>

        <Button
          className="S-Btn"
          variant="primary"
          type="submit"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Form>
    </Container>
  );
}

RegisterView.propTypes = {
  registeredUser: PropTypes.func.isRequired
};
