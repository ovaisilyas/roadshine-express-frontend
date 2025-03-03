import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../static/css/HeroBanner.css";
import home1 from "../../static/images/home-1.jpg";
import home2 from "../../static/images/home-2.jpg";

const HeroBanner = () => {
  const images = [
    home1,
    home2
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      // Move to the next slide, looping back to the start
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [images.length]);

  return (
    <div className="hero-banner">
      <div
        className="hero-slideshow"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <img key={idx} src={img} alt={`Slide ${idx + 1}`} />
        ))}
      </div>
      <div class="hero-text">
        <h1 className="hero-heading">Professional Truck Washing & Detailing You Can Trust</h1>
        <p>At Roadshine Express LLC, we deliver unmatched fleet care using cutting-edge technology
          and premium products—ensuring your trucks shine inside and out.
        </p>
        <br/>
        <h2 className="hero-h2">Why Choose Us?</h2>
        <p>✔ Spotless Exterior Cleaning: Dirt, grime, and road salt—gone.</p>
        <p>✔ Interior Detailing: Disinfected, sanitized, and load-ready.</p>
        <p>✔ Fleet Maintenance Plans: Flexible packages for peak performance.</p>
        <p>✔ Polishing & Detailing: Aluminum, tires, and bug removal—flawless finish.</p>
        <br/>
        <h2>Experience the Roadshine Difference:</h2>
        <p>Fast & Reliable: Trucks back on the road—showroom-ready.</p>
        <p>Eco-Friendly: Powerful cleaning, planet-safe.</p>
        <p>Easy Booking: Schedule in seconds—zero wait time.</p>
        <br/>
        <h2>Keep Your Fleet Shining!</h2>
        <p><button onClick={() => navigate("/contact")}>Get a Free Quote Now</button> and see the Roadshine standard in action!</p>
      </div>
    </div>
  );
};

export default HeroBanner;
