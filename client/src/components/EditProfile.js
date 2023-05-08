import React from 'react';
import { Segment, Grid, Form, Button } from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { userState } from '../atoms';

function EditProfile({ user, setUser }) {
  const history = useHistory();
  console.log(user)

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = yup.object({
    username: yup.string().required('Please enter a username.'),
    password: yup
      .string()
      .min(5, 'Username must have a minimum of 5 characters.')
      .max(20, 'Password must have at most 20 characters.'),
  });

  const onSubmit = (values) => {
    fetch(`/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Network response was not ok');
      })
      .then((data) => {
        setUser(data);
        history.push('/');
        setUser(undefined)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDelete = () => {
    fetch(`/users/${user.id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Network response was not ok');
      })
      .then(() => {
        window.alert('User deleted successfully. Hope to see you again soon.');
        setUser(undefined);
        history.push('/');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="ui inverted form">
      <Segment id="editprofile" secondary>
        <Grid>
          <Grid.Column verticalAlign='middle'>
            <Form onSubmit={formik.handleSubmit}>
              <h1>Edit Profile</h1>
              <Form.Field className="form-field">
                <label>New Username</label>
                <Form.Input className="form-inputs" style={{fontFamily: 'Almarai'}}
                  name='username'
                  type='text'
                  placeholder='Username'
                  value={formik.values.username}
                  onChange={formik.handleChange}
                />
                {formik.touched.username && formik.errors.username ? (
                  <p style={{ color: '#ff0000' }}>{formik.errors.username}</p>
                ) : null}
              </Form.Field>
              <br />
              <Form.Field className="form-field">
                <label>New Password</label>
                <Form.Input className="form-inputs"
                  name='password'
                  type='password'
                  placeholder='Password'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                {formik.touched.password && formik.errors.password ? (
                  <p style={{ color: '#ff0000' }}>{formik.errors.password}</p>
                ) : null}
              </Form.Field>
              <br />
              <Button className='ui inverted violet basic button' type='submit'>
                Update Credentials
              </Button>
            </Form>
          </Grid.Column>
        </Grid>
      </Segment>
      <div style={{ textAlign: 'right' }}>
        <Button className='ui inverted violet basic button' onClick={handleDelete}>
          Delete your Profile
        </Button>
      </div>
    </div>
  );

};

export default EditProfile;