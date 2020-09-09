import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./updateuser-styles.scss";
import axios from "axios";

export function UpdateUserView(props) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    axios
      .put(
        `https://scarpantonioapi.herokuapp.com/users/${username}`,
        {
          Username: username,
          Email: email,
          Password: password
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then(response => {
        alert("Your account has been updated!");
        window.open("/profile", "_self");
      })
      .catch(err => {
        console.log("unable to update user" + err);
      });
  };

  const username = localStorage.getItem("user");
  return (
    <Container className="formStyle">
      <h2 className="r-title">Update account</h2>
      <Form className="inputStyles">
        <Form.Group controlId="formBasicUsername">
          <Form.Text className="text-muted">
            {username} username can't be updated
          </Form.Text>
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
        <br />
        <br />
        <Link to={`/profile`}>Back</Link>
      </Form>
    </Container>
  );
}
