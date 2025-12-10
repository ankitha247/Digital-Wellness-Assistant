// src/components/Layout.jsx
import React from 'react';

export const FullscreenCenter = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
      color: '#ffffff',
      padding: '1.5rem',
    }}>
      {children}
    </div>
  );
};

export const AppContainer = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
      color: '#ffffff',
    }}>
      {children}
    </div>
  );
};