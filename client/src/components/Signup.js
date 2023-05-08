import React from 'react';
import { Segment, Grid, Button, Form } from 'semantic-ui-react';
import { useFormik } from "formik";
import * as yup from "yup";
import { useHistory } from "react-router-dom";

const Signup = ({ setUser }) => {
    const history = useHistory();

    const formSchema = yup.object().shape({
        username: yup.string()
            .required('Required')
            .min(5, 'Username must have a minimum of 5 characters.')
            .max(15, 'Username must have at most 15 characters.')
            .required('Required'),
        password: yup.string()
            .required('No password provided.')
            .min(5, 'Password must have a minimum of 5 characters.')
            .matches(/[\d\w]/, 'Password can only contain letters and numbers.'),
        confirm_password: yup.string()
            .oneOf([yup.ref("password")], "Passwords do not match")
            .required("Confirm password."),
    })

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log("Creating a user...")
            if (formik.isValid) {
                fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                }).then(res => {
                    if (res.ok) {
                        res.json().then(new_user => setUser(new_user))
                        console.log("User successfully created!")
                        history.push('/home')
                    } else {
                        res.json().then(err => {
                            console.log(err)
                            alert('Oops, username is already taken. Please choose another one.')
                        })
                    }
                }).catch(err => {
                    console.error('Error during fetch:', err);
                });
            }
        }
    })

    return (
        <div className="ui inverted form">
            <Segment secondary id="segment">
                <Grid >
                    <Grid.Column >
                        <Form onSubmit={formik.handleSubmit}>
                            <h1 id="signup">Sign Up</h1>
                            <Form.Field validate>
                                <label>Username</label>
                                <Form.Input className="form-inputs"
                                    type="text"
                                    name="username"
                                    placeholder='Username'
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                />
                                <p style={{ color: "#FF0000" }}> {formik.errors.username}</p>

                            </Form.Field>
                            <Form.Field validate>
                                <label>Password</label>
                                <Form.Input className="form-inputs"
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder='Password'
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                />
                                <p style={{ color: "#FF0000" }}> {formik.errors.password}</p>
                            </Form.Field>
                            <Form.Field validate>
                                <label>Confirm Password</label>
                                <Form.Input className="form-inputs"
                                    id="confirm-password"
                                    name="confirm_password"
                                    type="password"
                                    placeholder='Confirm Password'
                                    onChange={formik.handleChange}
                                    value={formik.values.confirm_password}
                                />
                                <p style={{ color: "#FF0000" }}> {formik.errors.confirm_password}</p>
                            </Form.Field>
                            <Button
                                className='ui inverted violet basic button'
                                onClick={formik.handleSubmit}
                                type='submit'>Sign Up</Button>
                        </Form>
                    </Grid.Column>
                </Grid>
            </Segment>
        </div>
    )
}

export default Signup;