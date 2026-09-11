import React, { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const initialForm = {
  email: '',
  password: '',
  terms: false,
};

export default function Login() {
  const [form, setForm] = useState(initialForm);

  const navigate = useNavigate();

  const handleChange = (event) => {
    let { name, value, type, checked } = event.target;
    const val = type === 'checkbox' ? checked : value;
    setForm({ ...form, [name]: val });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

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
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="exampleEmail">Email</Label>
        <Input
          id="exampleEmail"
          name="email"
          placeholder="Enter your email"
          type="email"
          onChange={handleChange}
          value={form.email}
        />
      </FormGroup>
      <FormGroup>
        <Label for="examplePassword">Password</Label>
        <Input
          id="examplePassword"
          name="password"
          placeholder="Enter your password "
          type="password"
          onChange={handleChange}
          value={form.password}
        />
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
        />
        <label htmlFor="terms">
          I agree to terms of service and privacy policy
        </label>
      </FormGroup>

      <FormGroup className="text-center p-4">
        <Button disabled={!form.terms} color="primary">
          Sign In
        </Button>
      </FormGroup>
    </Form>
  );
}
