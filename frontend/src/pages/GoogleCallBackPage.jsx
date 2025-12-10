// src/pages/GoogleCallBackPage.jsx - UPDATED
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GoogleCallBackPage = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const from = params.get('from');
    const userId = params.get('userId');
    const name = params.get('name');
    const email = params.get('email');
    const token = params.get('token');

    console.log('Google callback params:', { from, userId, name, email, token });

    if (from === 'google' && userId && email) {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: Number(userId),
        email: email,
        name: name || 'Google User',
      }));
      localStorage.setItem('current_user_id', userId);

      // Redirect to profile setup
      window.location.href = '/profile-setup';
    } else {
      // If invalid callback, redirect to login
      window.location.href = '/login';
    }
  }, [location.search]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      color: 'white',
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'white',
          animation: 'pulse 2s infinite',
        }} />
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
        Signing in with Google
      </h2>
      <p style={{ color: '#94a3b8' }}>
        Please wait while we set up your account...
      </p>
      
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(0.8); opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export default GoogleCallBackPage;