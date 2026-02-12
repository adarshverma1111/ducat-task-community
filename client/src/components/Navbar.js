import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiPlusCircle, FiUser, FiLogOut, FiLogIn } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <h2>Community Platform</h2>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <FiHome /> Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/create-post" className="nav-link">
                <FiPlusCircle /> New Post
              </Link>
              <Link to="/profile" className="nav-link">
                <FiUser /> Profile
              </Link>
              <button onClick={handleLogout} className="nav-link btn-link">
                <FiLogOut /> Logout
              </button>
              <div className="user-info">
                <img 
                  src={user?.avatar || 'https://via.placeholder.com/40'} 
                  alt={user?.username} 
                  className="user-avatar"
                />
                <span className="user-name">{user?.username}</span>
                {user?.role === 'admin' && (
                  <span className="badge badge-admin">Admin</span>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <FiLogIn /> Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-small">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
