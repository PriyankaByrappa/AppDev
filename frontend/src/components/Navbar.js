import React, { useState } from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignUpModal';

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>Cookie Store</h2>
        <div style={styles.links}>
          <a href="#home" style={styles.link}>Home</a>
          <a href="#about" style={styles.link}>About</a>
          <a href="#contact" style={styles.link}>Contact</a>
          <button style={styles.btn} onClick={() => setShowLogin(true)}>Login</button>
          <button style={styles.btnOutline} onClick={() => setShowSignup(true)}>Sign Up</button>
        </div>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
    </>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2px 40px',
    backgroundColor: '#fff8e1',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  logo: {
    fontSize: '24px',
    color: '#1f1c1aff',
    fontWeight: 'bold'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  link: {
    textDecoration: 'none',
    color: '#444',
    fontWeight: 500
  },
  btn: {
    backgroundColor: '#5947ffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 'bold'
  },
  btnOutline: {
    backgroundColor: 'transparent',
    border: '2px solid #0a0906ff',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#080706ff',
    fontWeight: 'bold'
  }
};

export default Navbar;
