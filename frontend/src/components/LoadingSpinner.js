import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', color = 'orange' }) => {
  const sizeStyles = {
    small: { width: '20px', height: '20px' },
    medium: { width: '32px', height: '32px' },
    large: { width: '48px', height: '48px' },
  };

  const spinnerStyle = {
    display: 'inline-block',
    ...sizeStyles[size],
    borderBottom: `2px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const containerStyle = {
    textAlign: 'center',
    padding: '16px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      {text && <p style={{ margin: 0, color: '#4B5563', fontSize: '14px' }}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
