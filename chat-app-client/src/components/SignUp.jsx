import React, { useState } from 'react';
import { Button, TextField, Typography, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { signUpUser } from '../slices/authSlice'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';  // Import Link component for navigation

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');  // State for displaying error messages
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);  // Get loading status from Redux
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');  // Reset error message before making the API call
    dispatch(signUpUser({ email, password, fullName, role }))
      .then((response) => {
        if (response.payload?.status === false) {
          // If email already exists, show an error message
          setError(response.payload?.message || 'Signup failed');
        } else {
          // Redirect to signin page after successful signup
          navigate('/signin');
        }
      })
      .catch((error) => {
        // Handle any unexpected errors
        console.error('Signup error:', error);
        setError('An error occurred. Please try again.');
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg w-96">
        <Typography variant="h4" className="text-center mb-4">Sign Up</Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mb-4"
          />
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
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
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
              Sign Up
            </Button>
          )}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
        <div className="text-center mt-4">
          <Typography variant="body2">
            Already have an account? <Link to="/signin" className="text-blue-500">Sign in here</Link>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
