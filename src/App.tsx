import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import FileUpload from './FileUpload';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import FileList from './FileList';
import DataVisualization from './DataVisualization'; // Include DataVisualization
import Navbar from './Navbar';
import ProtectedRoute from './ProtectedRoute';
import Chatbot from './Chatbot'; // Include Chatbot

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleChatbotQuery = (query: string) => {
    console.log('Chatbot query:', query);
    // Integrate query functionality here (e.g., trigger filtering, data loading)
  };

  return (
    <Router>
      {/* Move useLocation inside the Router */}
      <NavbarWrapper isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div className="mx-auto min-h-[100vh] w-full bg-[rgb(19,22,25)]">
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/profile" /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={
              !isLoggedIn ? (
                <Login onLoginSuccess={handleLoginSuccess} />
              ) : (
                <Navigate to="/profile" />
              )
            }
          />
          <Route
            path="/register"
            element={
              !isLoggedIn ? (
                <Register />
              ) : (
                <Navigate to="/profile" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <FileUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/files"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <FileList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visualize/:fileId"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <>
                  <DataVisualization /> {/* This is where you visualize data */}
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <DataVisualization />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Chatbot component available globally */}
        {isLoggedIn && <Chatbot onDataQuery={handleChatbotQuery} />}

      </div>
    </Router>
  );
};

// New component to handle Navbar rendering logic
const NavbarWrapper: React.FC<{ isLoggedIn: boolean; handleLogout: () => void }> = ({ isLoggedIn, handleLogout }) => {
  const location = useLocation(); // Now inside Router, so no error

  // Conditionally render Navbar based on location
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />;
};

export default App;
