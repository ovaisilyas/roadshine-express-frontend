import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import "../../static/css/Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-links">
        <ul>
          <li><a onClick={() => navigate("/about")}>About Us</a></li>
          <li><a onClick={() => navigate("/services")}>Services</a></li>
          <li><a onClick={() => navigate("/contact")}>Contact</a></li>
        </ul>
      </div>

      <p>&copy; 2025 Roadshine Express. All Rights Reserved.</p>

      <p>
        <a href="/privacy-policy" className="privacy-policy">Privacy Policy</a>
      </p>

      <div className="footer-social">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faFacebookF} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faLinkedinIn} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
