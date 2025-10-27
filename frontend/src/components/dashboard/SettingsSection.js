import React, { useState, useEffect } from 'react';
import { FaCog, FaBell, FaLock, FaPalette, FaLanguage, FaSave, FaSun, FaMoon } from 'react-icons/fa';

const SettingsSection = () => {
  const [settings, setSettings] = useState({
    notifications: { email: true, push: false, sms: false },
    privacy: { profileVisibility: 'public', dataSharing: false },
    preferences: { theme: 'light', language: 'en', currency: 'USD' }
  });

  // Theme effect
  useEffect(() => {
    if (settings.preferences.theme === 'dark') {
      document.body.style.backgroundColor = '#1F2937';
      document.body.style.color = '#F9FAFB';
    } else {
      document.body.style.backgroundColor = '#F3F4F6';
      document.body.style.color = '#111827';
    }
  }, [settings.preferences.theme]);

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      preferences: { ...prev.preferences, theme: prev.preferences.theme === 'light' ? 'dark' : 'light' }
    }));
  };

  const handleNotificationChange = (type) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [type]: !prev.notifications[type] }
    }));
  };

  const handlePrivacyChange = (type, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [type]: value }
    }));
  };

  const handlePreferenceChange = (type, value) => {
    setSettings(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [type]: value }
    }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  // Modern full-screen styles
  const containerStyle = {
    minHeight: '100vh',
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    transition: 'all 0.3s'
  };
  const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
  const titleStyle = { fontSize: '32px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px' };
  const subtitleStyle = { color: '#6B7280', fontSize: '16px' };

  const cardStyle = {
    backgroundColor: 'var(--card-bg, white)',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    padding: '32px',
    width: '100%',
    maxWidth: '800px',
    transition: 'all 0.3s',
    alignSelf: 'center'
  };
  const flexBetween = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' };
  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' };
  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #D1D5DB',
    borderRadius: '12px',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: 'var(--input-bg, #F9FAFB)',
    color: 'var(--text-color, #111827)',
    transition: 'all 0.3s'
  };
  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#FF7F50',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s'
  };
  const themeButtonStyle = {
    padding: '8px 12px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#FF7F50',
    color: 'white'
  };

  // Apply dark/light variables
  const isDark = settings.preferences.theme === 'dark';
  document.documentElement.style.setProperty('--card-bg', isDark ? '#374151' : '#ffffff');
  document.documentElement.style.setProperty('--input-bg', isDark ? '#4B5563' : '#F9FAFB');
  document.documentElement.style.setProperty('--text-color', isDark ? '#F9FAFB' : '#111827');

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}><FaCog style={{ color: '#FF7F50' }} /> Settings</h1>
          <p style={subtitleStyle}>Customize your experience</p>
        </div>
        <button style={themeButtonStyle} onClick={toggleTheme}>
          {isDark ? <FaSun /> : <FaMoon />} {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Notifications */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <FaBell style={{ color: '#FF7F50' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Notifications</h2>
        </div>
        {['email', 'push', 'sms'].map(type => (
          <div key={type} style={flexBetween}>
            <div>
              <h3 style={{ fontWeight: '500' }}>{type.charAt(0).toUpperCase() + type.slice(1)} Notifications</h3>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>
                {type === 'email' ? 'Receive updates via email' : type === 'push' ? 'Receive browser notifications' : 'Receive text message updates'}
              </p>
            </div>
            <input type="checkbox" checked={settings.notifications[type]} onChange={() => handleNotificationChange(type)} />
          </div>
        ))}
      </div>

      {/* Privacy */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <FaLock style={{ color: '#FF7F50' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Privacy</h2>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Profile Visibility</label>
          <select
            value={settings.privacy.profileVisibility}
            onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
            style={inputStyle}
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div style={flexBetween}>
          <div>
            <h3 style={{ fontWeight: '500' }}>Data Sharing</h3>
            <p style={{ fontSize: '12px', color: '#6B7280' }}>Allow data sharing for analytics</p>
          </div>
          <input type="checkbox" checked={settings.privacy.dataSharing} onChange={() => handlePrivacyChange('dataSharing', !settings.privacy.dataSharing)} />
        </div>
      </div>

      {/* Preferences */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <FaPalette style={{ color: '#FF7F50' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Preferences</h2>
        </div>
        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Theme</label>
            <select value={settings.preferences.theme} onChange={(e) => handlePreferenceChange('theme', e.target.value)} style={inputStyle}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Language</label>
            <select value={settings.preferences.language} onChange={(e) => handlePreferenceChange('language', e.target.value)} style={inputStyle}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Currency</label>
            <select value={settings.preferences.currency} onChange={(e) => handlePreferenceChange('currency', e.target.value)} style={inputStyle}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleSaveSettings} style={buttonStyle}><FaSave /> Save Settings</button>
      </div>
    </div>
  );
};

export default SettingsSection;
