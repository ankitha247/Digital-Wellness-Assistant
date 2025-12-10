// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Brain, MessageSquare, History, LogOut, User, Home } from 'lucide-react';
import { colors, gradients } from '../theme/colors';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user from localStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('user');
    localStorage.removeItem('current_user_id');
    localStorage.removeItem('profile_completed');
    
    // Redirect to login
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/assistant', label: 'Assistant', icon: <MessageSquare size={20} /> },
    { path: '/history', label: 'History', icon: <History size={20} /> },
  ];

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '0 2rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: gradients.primary,
              borderRadius: '12px',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Brain size={24} color="white" />
            </div>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #ffffff, #93c5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Wellness.AI
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                background: isActive(item.path) 
                  ? 'rgba(59, 130, 246, 0.2)' 
                  : 'transparent',
                border: `1px solid ${
                  isActive(item.path) 
                    ? colors.primary[500] 
                    : 'transparent'
                }`,
                color: isActive(item.path) 
                  ? colors.primary[400] 
                  : colors.neutral[400],
                ':hover': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: colors.neutral[300],
                }
              }}
            >
              {item.icon}
              <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: gradients.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <User size={16} color="white" />
              </div>
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'white',
                }}>
                  {user.name}
                </p>
                <p style={{
                  fontSize: '0.75rem',
                  color: colors.neutral[500],
                }}>
                  {user.email}
                </p>
              </div>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${colors.error}30`,
              borderRadius: '8px',
              color: colors.error,
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              ':hover': {
                background: 'rgba(239, 68, 68, 0.2)',
                transform: 'translateY(-1px)',
              }
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;