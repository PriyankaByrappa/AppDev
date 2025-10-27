import React, { useState, useEffect } from 'react';
import { FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaStar, FaCheckCircle, FaEnvelope } from 'react-icons/fa';
import Navbar from './Navbar';

const cookiesData = [
  { 
    name: 'Red Velvet Cookie', 
    img: 'https://media.istockphoto.com/id/171252521/photo/plate-of-red-velvet-cookies.webp?a=1&b=1&s=612x612&w=0&k=20&c=JIBRUmxtELADIr_t-w8PmqI_7f0P_EHpQUKRP7mowfI=', 
    details: 'Soft, chewy red velvet cookies topped with chocolate chips.' 
  },
  { 
    name: 'Macaron Cookie', 
    img: 'https://media.istockphoto.com/id/904540928/photo/multi-colored-macaroons-in-a-blue-plate-shot-on-blue-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=r8zcf3ZwXyZLEqFyGPkr1BK2rmBh0itGPY43KPgT9Us=',
    details: 'Classic sugar cookies with a hint of vanilla flavor.' 
  },
  { 
    name: 'Snickerdoodle', 
    img: 'https://media.istockphoto.com/id/170619039/photo/snickerdoodles.webp?a=1&b=1&s=612x612&w=0&k=20&c=qvA3BkG0cD38DJtXkYtI827_f6eVN9x7KRUh7yVgt40=', 
    details: 'Cinnamon sugar coated cookies, soft and chewy.' 
  }
];

const features = [
  { icon: <FaCheckCircle />, title: 'Fresh Ingredients', desc: 'Made with the finest, organic ingredients.' },
  { icon: <FaCheckCircle />, title: 'Fast Delivery', desc: 'Quick and reliable delivery to your doorstep.' },
  { icon: <FaCheckCircle />, title: 'Custom Orders', desc: 'Personalize your cookies for special occasions.' }
];

const testimonials = [
  { name: 'Alice Johnson', review: 'Absolutely delicious! Best cookies ever.', rating: 5 },
  { name: 'Bob Smith', review: 'Fast service and great quality.', rating: 5 },
  { name: 'Charlie Brown', review: 'Will order again. Highly recommend!', rating: 4 }
];

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCookie, setSelectedCookie] = useState('');

  // Auto-play slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % cookiesData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % cookiesData.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + cookiesData.length) % cookiesData.length);
  const toggleFlip = (index) => setFlippedIndex(flippedIndex === index ? null : index);

  const orderCookie = (name) => {
    setSelectedCookie(name);
    setShowModal(true);
  };

  const handleOrderConfirm = () => {
    alert(`Order placed for ${selectedCookie}!`);
    setShowModal(false);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Subscribed with ${email}!`);
    setEmail('');
  };

  return (
    <div style={styles.container}>
      <Navbar />

      {/* Home Section */}
      <section id="home" style={{ ...styles.section, background: 'linear-gradient(135deg, #fff0db, #ffe0a3)', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={styles.title}>Welcome to Cookie Store</h1>
        <p style={styles.text}>Delicious biscuits baked with love and quality ingredients.</p>

        {/* Slideshow */}
        <div style={styles.carousel}>
          <button onClick={prevSlide} style={styles.navBtn}>‹</button>
          <div style={styles.slide}>
            <img src={cookiesData[currentSlide].img} alt={cookiesData[currentSlide].name} style={styles.slideImg} />
            <h3 style={styles.cookieName}>{cookiesData[currentSlide].name}</h3>
            <button style={styles.ctaBtn} onClick={() => orderCookie(cookiesData[currentSlide].name)}>Order Now</button>
          </div>
          <button onClick={nextSlide} style={styles.navBtn}>›</button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ ...styles.section, backgroundColor: '#f9f9f9' }}>
        <h2 style={styles.subtitle}>Why Choose Us?</h2>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.text}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ ...styles.section, backgroundColor: '#fff8e1' }}>
        <h2 style={styles.subtitle}>About Cookie Store</h2>
        <p style={styles.text}>
          Cookie Store Management System is a full-stack project where users can browse, manage, and order cookies online. 
          Admins can add, edit, and track cookie inventory. This system uses React for frontend, Spring Boot for backend, 
          and MySQL for database management. It integrates role-based authentication and interactive image-based UI for a better user experience.
        </p>

        {/* Clickable cookie images */}
        <div style={styles.gallery}>
          {cookiesData.map((cookie, index) => (
            <div key={index} style={styles.flipCard} onClick={() => toggleFlip(index)}>
              <div style={{ ...styles.flipInner, transform: flippedIndex === index ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                <div style={styles.flipFront}>
                  <img src={cookie.img} alt={cookie.name} style={styles.img} />
                  <p style={styles.cookieName}>{cookie.name}</p>
                </div>
                <div style={styles.flipBack}>
                  <p style={styles.text}>{cookie.details}</p>
                  <button style={styles.ctaBtn} onClick={() => orderCookie(cookie.name)}>Order Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={{ ...styles.section, background: 'linear-gradient(135deg, #ffe0a3, #ffb347)' }}>
        <h2 style={styles.subtitle}>What Our Customers Say</h2>
        <div style={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} style={styles.testimonialCard}>
              <div style={styles.rating}>
                {[...Array(testimonial.rating)].map((_, i) => <FaStar key={i} style={styles.star} />)}
              </div>
              <p style={styles.text}>"{testimonial.review}"</p>
              <p style={styles.testimonialName}>- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" style={{ ...styles.section, backgroundColor: '#f0f0f0' }}>
        <h2 style={styles.subtitle}>Stay Updated</h2>
        <p style={styles.text}>Subscribe to our newsletter for the latest offers and new cookie arrivals.</p>
        <form onSubmit={handleNewsletterSubmit} style={styles.newsletterForm}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.ctaBtn}><FaEnvelope /> Subscribe</button>
        </form>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ ...styles.section, background: 'linear-gradient(135deg, #ffe0a3, #ffb347)', paddingBottom: '40px' }}>
        <h2 style={styles.subtitle}>Contact Us</h2>
        <p style={styles.text}><FaPhone /> +91 98765 43210</p>
        <div style={styles.socialIcons}>
          <a href="https://twitter.com" style={styles.icon}><FaTwitter /></a>
          <a href="https://instagram.com" style={styles.icon}><FaInstagram /></a>
          <a href="https://linkedin.com" style={styles.icon}><FaLinkedin /></a>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div>© 2025 Cookie Store. All Rights Reserved.</div>
      </footer>

      {/* Order Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Confirm Order</h3>
            <p>Are you sure you want to order {selectedCookie}?</p>
            <div style={styles.modalButtons}>
              <button style={styles.ctaBtn} onClick={handleOrderConfirm}>Yes</button>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, padding: 0, boxSizing: 'border-box' },
  section: { textAlign: 'center', padding: '60px 20px', scrollBehavior: 'smooth' },
  title: { fontSize: '42px', color: '#141315ff', marginBottom: '15px', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' },
  subtitle: { fontSize: '34px', color: '#a0522d', marginBottom: '20px' },
  text: { fontSize: '18px', color: '#201f1fff', marginBottom: '20px' },
  carousel: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '30px' },
  slide: { textAlign: 'center', transition: 'all 0.5s ease-in-out' },
  slideImg: { width: '400px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', transition: 'transform 0.3s', cursor: 'pointer' },
  navBtn: { backgroundColor: '#ffb347', border: 'none', padding: '10px 15px', fontSize: '24px', borderRadius: '50%', cursor: 'pointer', color: '#fff', marginTop: '50px', transition: 'background 0.3s' },
  ctaBtn: { marginTop: '10px', padding: '10px 20px', backgroundColor: '#ff8c00', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', transition: 'transform 0.3s' },
  gallery: { display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '30px' },
  img: { width: '250px', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.3s' },
  flipCard: { perspective: '1000px', cursor: 'pointer', marginBottom: '20px' },
  flipInner: { position: 'relative', width: '250px', height: '300px', textAlign: 'center', transition: 'transform 0.8s ease-in-out', transformStyle: 'preserve-3d' },
  flipFront: { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' },
  flipBack: { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', backgroundColor: '#ffefc2', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px' },
  cookieName: { fontWeight: 'bold', marginTop: '10px' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' },
  featureCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.3s' },
  featureIcon: { fontSize: '40px', color: '#d67c0eff', marginBottom: '10px' },
  featureTitle: { fontSize: '24px', color: '#a0522d', marginBottom: '10px' },
  testimonialsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' },
  testimonialCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.3s' },
  rating: { marginBottom: '10px' },
  star: { color: '#ffd700' },
  testimonialName: { fontWeight: 'bold', color: '#a0522d' },
  newsletterForm: { display: 'flex', justifyContent: 'center', gap: '10px', maxWidth: '500px', margin: '0 auto' },
  input: { padding: '10px', border: '1px solid #ccc', borderRadius: '5px', flex: 1 },
  socialIcons: { display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '28px', marginTop: '10px' },
  icon: { color: '#fff', transition: '0.3s' },
  footer: { textAlign: 'center', padding: '20px', background: '#a0522d', color: '#fff' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', textAlign: 'center' },
  modalButtons: { display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' },
  cancelBtn: { padding: '10px 20px', backgroundColor: '#ccc', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};

export default LandingPage;

