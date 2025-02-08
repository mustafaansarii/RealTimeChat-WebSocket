import React, { useState } from 'react';
import { Button, TextField, Typography, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../slices/authSlice'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';  // Import Link component for navigation

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // State for displaying error messages
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);  // Get loading status from Redux
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');  // Reset error message before making the API call
    dispatch(loginUser({ email, password }))
      .then((response) => {
        if (response.payload?.status === false) {
          // If login fails, show an error message
          setError('Enter correct details');
        } else {
          // Redirect to home page after successful signin
          navigate('/home');
        }
      })
      .catch((error) => {
        // Handle any unexpected errors
        console.error('Login error:', error);
        setError('An error occurred. Please try again.');
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg w-96">
        <Typography variant="h4" className="text-center mb-4">Sign In</Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          {status === 'loading' ? (
            <CircularProgress />
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="py-2 mt-4"
            >
              Sign In
            </Button>
          )}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
        <div className="text-center mt-4">
          <Typography variant="body2">
            Don't have an account? <Link to="/signup" className="text-blue-500">Sign up here</Link>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
