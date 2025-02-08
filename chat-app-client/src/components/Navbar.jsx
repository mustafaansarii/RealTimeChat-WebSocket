import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice'
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);  // Get user & token from state

  const handleLogout = () => {
    dispatch(logout());  // Dispatch logout action
    navigate('/signin');  // Redirect to SignIn page after logout
  };

  return (
    <nav className="p-4 bg-gray-800 text-white">
      <ul className="flex space-x-4">
        <li>
          <Link to="/home">Home</Link>
        </li>
        {!token ? (
          <>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        ) : (
          <li>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
