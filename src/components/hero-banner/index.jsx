import React, { useState, useEffect } from "react";
import "../../static/css/HeroBanner.css";
import home1 from "../../static/images/home-1.jpg";
import home2 from "../../static/images/home-2.jpg";

const HeroBanner = () => {
  const images = [
    home1,
    home2
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

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
        <h1>Professional Truck Washing & Detailing</h1>
        <p>Keeping your fleet spotless with cutting-edge technology and exceptional service.</p>
        <button>Get a Free Quote</button>
      </div>
    </div>
  );
};

export default HeroBanner;
