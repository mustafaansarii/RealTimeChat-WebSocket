import React from 'react';
import { useSelector } from 'react-redux';
import Chat from './ChatApp'

const Home = () => {
  const { user } = useSelector((state) => state.auth);  // Get user info from Redux state

  return (
    <div className="p-8">
      <h1>Welcome to Home Page</h1>
      {user ? (
        <>
          <p>Welcome, {user.fullName}!</p>
          <Chat/>
  
        </>
      ) : (
        <p>Please sign in to enjoy the full features.</p>
      )}
    </div>
  );
};

export default Home;
