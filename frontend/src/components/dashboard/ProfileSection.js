import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const ProfileSection = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
    setIsEditing(false);
  };

  // Full-screen Modern Styles
  const containerStyle = {
    padding: '40px',
    backgroundColor: '#F3F4F6',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    gap: '40px'
  };
  const headerStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
  const titleStyle = { fontSize: '32px', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', gap: '12px' };
  const subtitleStyle = { color: '#6B7280', fontSize: '16px' };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    padding: '32px',
    width: '100%',
    maxWidth: '800px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    alignSelf: 'center'
  };
  const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
  const buttonStyle = (bgColor) => ({
    padding: '10px 20px',
    backgroundColor: bgColor,
    color: 'white',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s'
  });
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' };
  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #D1D5DB', borderRadius: '12px', outline: 'none', fontSize: '14px', transition: 'all 0.3s', backgroundColor: '#F9FAFB' };

  const statContainerStyle = { display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' };
  const statCardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    padding: '24px',
    flex: '1',
    minWidth: '180px',
    textAlign: 'center',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer'
  };
  const statNumberStyle = { fontSize: '24px', fontWeight: '700', color: '#FF7F50', marginBottom: '8px' };
  const statLabelStyle = { fontSize: '14px', color: '#6B7280' };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}><FaUser style={{ color: '#FF7F50' }} /> Profile</h1>
        <p style={subtitleStyle}>Manage your account information</p>
      </div>

      {/* Personal Info Card */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Personal Information</h2>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} style={buttonStyle('#FF7F50')}>
              <FaEdit /> Edit
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleSave} style={buttonStyle('#22C55E')}><FaSave /> Save</button>
              <button onClick={handleCancel} style={buttonStyle('#6B7280')}><FaTimes /> Cancel</button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            {isEditing ? (
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={inputStyle} />
            ) : (
              <p style={{ fontSize: '16px', color: '#111827' }}>{user?.name || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label style={labelStyle}><FaEnvelope style={{ marginRight: '4px' }} /> Email Address</label>
            {isEditing ? (
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={inputStyle} />
            ) : (
              <p style={{ fontSize: '16px', color: '#111827' }}>{user?.email || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label style={labelStyle}><FaPhone style={{ marginRight: '4px' }} /> Phone Number</label>
            {isEditing ? (
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={inputStyle} />
            ) : (
              <p style={{ fontSize: '16px', color: '#111827' }}>{user?.phone || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label style={labelStyle}><FaMapMarkerAlt style={{ marginRight: '4px' }} /> Address</label>
            {isEditing ? (
              <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} style={inputStyle} />
            ) : (
              <p style={{ fontSize: '16px', color: '#111827' }}>{user?.address || 'Not provided'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={statContainerStyle}>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>12</div>
          <div style={statLabelStyle}>Total Orders</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>$245.50</div>
          <div style={statLabelStyle}>Total Spent</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>4.8</div>
          <div style={statLabelStyle}>Avg Rating</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
