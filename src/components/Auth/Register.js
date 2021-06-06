import React, { Component } from "react";
import firebase from "../../firebase";
import md5 from "md5";
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

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    userRef: firebase.database().ref('users')
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
    } else if (!this.isPasswordValid(this.state)) {
      //throws password invalid error
      return false;
    } else {
      // form valid
      return true;
    }
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    let errors = [];
    let error;

    if (password.length < 6 || passwordConfirmation.length < 6) {
      error = { message: "Password must be upto 6 characters long" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (password !== passwordConfirmation) {
      error = { message: "Passwords do not match" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
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
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((createdUser) => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `https://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log("user saved");
              })
            })
            .catch((err) => {
              console.log(err);
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false,
              })
            })
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false,
          });
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

  saveUser = createdUser => {
    return this.state.userRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  render() {
    const { username, email, password, passwordConfirmation, errors, loading } =
      this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="blue" textAlign="center">
            <Icon name="rocketchat" color="blue" />
            Register for SaifChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={(event) => {
                  this.handleChange(event);
                  this.setState({ errors: [] });
                }}
                value={username}
                className={this.handleInputError(errors, "username")}
                type="text"
              />
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
              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={(event) => {
                  this.handleChange(event);
                  this.setState({ errors: [] });
                }}
                value={passwordConfirmation}
                className={this.handleInputError(errors, "password")}
                type="password"
              />

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="blue"
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
            Already a user?{" "}
            <Link to="/login" style={{ color: "blue" }}>
              Login
            </Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
