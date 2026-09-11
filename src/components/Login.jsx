import React, { useState } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const initialForm = {
  email: '',
  password: '',
  terms: false,
};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-zA-Z])\S{5,}$/;

function validate(form) {
  const errors = {};

  if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!passwordRegex.test(form.password)) {
    errors.password =
      'Password must be at least 5 characters, contain a letter, and have no spaces.';
  }
  if (!form.terms) {
    errors.terms = 'You must agree to the terms of service and privacy policy.';
  }

  return errors;
}

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();

  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (event) => {
    let { name, value, type, checked } = event.target;
    const val = type === 'checkbox' ? checked : value;
    setForm({ ...form, [name]: val });
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched({ ...touched, [name]: true });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isValid) {
      return;
    }

    axios
      .get('https://6540a96145bedb25bfc247b4.mockapi.io/api/login')
      .then((res) => {
        const user = res.data.find(
          (item) => item.password == form.password && item.email == form.email,
        );
        if (user) {
          setForm(initialForm);
          navigate('/success');
        } else {
          navigate('/error');
        }
      });
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormGroup>
        <Label for="exampleEmail">Email</Label>
        <Input
          id="exampleEmail"
          name="email"
          placeholder="Enter your email"
          type="email"
          onChange={handleChange}
          onBlur={handleBlur}
          value={form.email}
          invalid={touched.email && !!errors.email}
          data-testid="email-input"
        />
        <FormFeedback data-testid="email-error">{errors.email}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label for="examplePassword">Password</Label>
        <Input
          id="examplePassword"
          name="password"
          placeholder="Enter your password "
          type="password"
          onChange={handleChange}
          onBlur={handleBlur}
          value={form.password}
          invalid={touched.password && !!errors.password}
          data-testid="password-input"
        />
        <FormFeedback data-testid="password-error">
          {errors.password}
        </FormFeedback>
      </FormGroup>
      <FormGroup>
        <Input
          type="checkbox"
          color="primary"
          outline
          onChange={handleChange}
          checked={form.terms}
          name="terms"
          id="terms"
          data-testid="terms-input"
        />
        <label htmlFor="terms">
          I agree to terms of service and privacy policy
        </label>
      </FormGroup>

      <FormGroup className="text-center p-4">
        <Button disabled={!isValid} color="primary" data-testid="submit-button">
          Sign In
        </Button>
      </FormGroup>
    </Form>
  );
}
