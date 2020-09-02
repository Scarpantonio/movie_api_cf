import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./updateuser-styles.scss";
import axios from "axios";

export function UpdateUserView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    const username = localStorage.getItem("user");

    axios
      .put(`https://scarpantonioapi.herokuapp.com/users/${username}`, {
        Username: username,
        Password: password,
        Email: email
      })
      .then(response => {
        const data = response.data;
        console.log(data.Username);
        console.log(data.Email);
        console.log(data.Password);
        // const local = localStorage.setItem("user", data.Username);
        // console.log(local);
        // alert("Your account has been updated!");
        // console.log(data);
        // window.open("/profile", "_self");
      })
      .catch(err => {
        console.log(err);
        console.log("error updating the user");
      });
  };

  return (
    <Container className="formStyle">
      <h2 className="r-title">Update account</h2>
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

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password </Form.Label>
          <Form.Control
            size="md"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
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
        <Link to={`/profile`}>Back</Link>
      </Form>
    </Container>
  );
}
