import React from 'react';
import { Segment, Grid, Form, Button } from 'semantic-ui-react'
import { useFormik } from "formik";
import * as yup from "yup";
import { useHistory } from "react-router-dom";

const Login = ({ setUser }) => {
  const history = useHistory();

  const formSchema = yup.object({
    username: yup.string().required('Field required'),
    password: yup.string().required('Field required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
        .then(res => {
          if (res.ok) {
            res.json().then(user => {
              console.log(user)
              setUser(user);

              history.push('/home');
            });
          } else {
            alert('Something went wrong. Please try again.');
          }
        })
        .catch(error => {
          console.error('Error during fetch:', error);
        });
    }
  });


  return (
    <div className="ui inverted form">
      <Segment secondary id="segment">
        <Grid >
          <Grid.Column >
            <Form onSubmit={formik.handleSubmit}>
              <h1 id="login">Welcome to audiofeel.</h1>
              <br />
              <Form.Field className='form-field'>
                <label>Username</label>
                <Form.Input className="form-inputs"
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                />
                <p style={{ color: "#FF0000" }}> {formik.errors.username}</p>
              </Form.Field>
              <br />
              <Form.Field>
                <label>Password</label>
                <Form.Input className="form-inputs"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                <p style={{ color: "#FF0000" }}> {formik.errors.password}</p>
              </Form.Field>
              <br />
              <Button
                className='ui inverted violet basic button'
                type='submit' id="login-button">Log In</Button>
              <br />
            </Form>
          </Grid.Column>
        </Grid>
      </Segment>
      <p style={{ textAlign: 'center' }}>No account? Sign up <a id="signup-link" href="/signup">here.</a></p>
    </div>
  )
}

export default Login;