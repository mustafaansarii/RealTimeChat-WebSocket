import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './pages/Home';  // Home Page
import NavBar from './components/Navbar';
import { useSelector } from 'react-redux';
import Chat from "./pages/ChatApp"; // Import the Chat component

function App() {
  const { token } = useSelector((state) => state.auth);  // Check if user is authenticated

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/home" element={<Home />} />
        
        {/* Redirect to /home if user is logged in and tries to access /signin or /signup */}
        <Route path="/signin" element={token ? <Navigate to="/home" /> : <SignIn />} />
        <Route path="/signup" element={token ? <Navigate to="/home" /> : <SignUp />} />

        {/* New route for the chat application */}
        <Route path="/chat" element={token ? <Chat /> : <Navigate to="/signin" />} />

        {/* Default redirect to home page */}
        <Route path="/" element={<Navigate to={token ? "/home" : "/signin"} />} />
      </Routes>
    </Router>
  );
}

export default App;