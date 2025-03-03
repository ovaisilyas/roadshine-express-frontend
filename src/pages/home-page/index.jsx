import React, {/*useState*/} from "react";
import { useNavigate } from "react-router-dom";
import HeroBanner from "../../components/hero-banner";
import Footer from "../../components/footer";
import Header from "../../components/header";
import "../../static/css/LandingPage.css";

import servicesImg from "../../static/images/services-bg.jpg";
import contactImg from "../../static/images/contact-bg.jpg";
import whatWeDoImg from "../../static/images/whatwedo-bg.jpg";
import aboutImg from "../../static/images/about-bg.jpg";

const LandingPage = ({ user, setUser }) => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Header user={user} setUser={setUser} />
      <HeroBanner />

      {/* Services Section */}
      <section className="section">
        <div className="content">
          <h2>Our Services</h2>
          <ul>
            <li>✔ Full Exterior Truck Washing</li>
            <li>✔ Interior Detailing</li>
            <li>✔ Frame and Underbody Cleaning</li>
            <li>✔ Custom Detailing Packages</li>
          </ul>
          <button onClick={() => navigate("/services")} className="cta-btn">Book a Service</button>
        </div>
        <div className="image-container">
          <img src={servicesImg} alt="Services" />
        </div>
      </section>

      {/* What We Do Section */}
      <section className="section reverse">
        <div className="image-container">
          <img src={whatWeDoImg} alt="What We Do" />
        </div>
        <div className="content">
          <h2>What We Do</h2>
          <p>Professional Truck Washing Services: From individual trucks to fleets, we ensure your vehicles are spotless and road-ready.</p>
          <p>Innovative Web-Based Database: The only platform exclusively built for truck washing businesses, offering invoicing, payment processing, reports, truck profiles, and unlimited storage.</p>
          <button onClick={() => navigate("/services")} className="cta-btn">Learn More</button>
        </div>
      </section>

      {/* About Us Section */}
      <section className="section">
        <div className="content">
          <h2>About Us</h2>
          <p>We wash, clean inside and outside of the truck, paint the frame, and shine the rims.</p>
          <p>Located in Nashville, TN, we work with major truck dealerships to keep their fleets looking pristine. Whether it's a new truck that needs freshening up or a used truck that needs a complete flip—we’ve got you covered.</p>
          <button onClick={() => navigate("/about")} className="cta-btn">Read More</button>
        </div>
        <div className="image-container">
          <img src={aboutImg} alt="About Us" />
        </div>
      </section>

      {/* Contact Section */}
      <section className="section reverse">
        <div className="image-container">
          <img src={contactImg} alt="Contact" />
        </div>
        <div className="content">
          <h2>Contact Us</h2>
          <p>Reach out to us for bookings and inquiries:</p>
          <p>Email: roadshineexpress@gmail.com</p>
          <p>Phone: (615) 397-7418</p>
          <button onClick={() => navigate("/contact")} className="cta-btn">Get in Touch</button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;