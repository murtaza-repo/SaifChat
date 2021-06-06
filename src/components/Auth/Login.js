import React, { Component } from "react";
import firebase from "../../firebase";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";

import { Link } from "react-router-dom";

class Login extends Component {
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      // throws error
      error = { message: "Fill in all fields" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      // form valid
      return true;
    }
  };

  isFormEmpty = ({ email, password }) => {
    return (
      !email.length ||
      !password.length
    );
  };

  displayErrors = (errors) => {
    return errors.map((error, i) => <span key={i}>{error.message}</span>);
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
            console.log(signedInUser);
        })
        .catch(err => {
            this.setState({ errors: this.state.errors.concat(err), loading: false });
        });
    }
  };

  handleInputError = (errors, inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? "error"
      : "";
  };

  render() {
    const { email, password, errors, loading } =
      this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="violet" textAlign="center">
            <Icon name="rocketchat" color="violet" />
            Login for SaifChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={(event) => {
                  this.handleChange(event);
                  this.setState({ errors: [] });
                }}
                value={email}
                className={this.handleInputError(errors, "email")}
                type="email"
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={(event) => {
                  this.handleChange(event);
                  this.setState({ errors: [] });
                }}
                value={password}
                className={this.handleInputError(errors, "password")}
                type="password"
              />

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="violet"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>

          {errors.length > 0 && (
            <Message error>
              <i>
                <Icon name="warning" color="red" />
                {this.displayErrors(errors)}
              </i>
            </Message>
          )}

          <Message>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#6435c9" }}>
              Register
            </Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
