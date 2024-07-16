import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Homepage.css';
import Navbar from '../navbar';
const Home = () => {
  let Navigate  = useNavigate()
  const routeChange = ()=>{
    Navigate('/login')
  }
  return (
    <>   
    <Navbar />
     <div className="homepage">
      <header className="hero-section">
        <h1>Welcome to Careconnect</h1>
        <p>Your comprehensive healthcare facility management system.</p>
        <button className="cta-button" onClick={routeChange}>Get Started</button>
      </header>
      <section className="features-section">
        <div className="feature">
          <img src="/hospital.jpg" alt="Efficient Management" className="feature-image" />
          <h3>Efficient Management</h3>
          <p>Streamline operations and improve efficiency with our tools.</p>
        </div>
        <div className="feature">
          <img src="/reception.jpg" alt="Secure Data" className="feature-image" />
          <h3>Secure Data</h3>
          <p>Protect sensitive information with top-notch security measures.</p>
        </div>
        <div className="feature">
          <img src="./patient.jpg" alt="24/7 Support" className="feature-image" />
          <h3>24/7 Support</h3>
          <p>Get round-the-clock assistance from our dedicated support team.</p>
        </div>
      </section>
      <footer className="footer">
        <p>&copy; 2024 Careconnect. All rights reserved.</p>
      </footer>
    </div>
    </>

  );
};

export default Home;
