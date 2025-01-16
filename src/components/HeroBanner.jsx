import React from "react";
import "../static/css/HeroBanner.css";
import western from "../static/images/western.jpg";
import averittdaycab from "../static/images/averitt-daycab.jpg";
import averittsleeper from "../static/images/averitt-sleeper.jpg";

const HeroBanner = () => {
  const images = [
    western,
    averittdaycab,
    averittsleeper,
  ];

  return (
    <div className="hero-banner">
      <div className="hero-slideshow">
      {images.map((img, idx) => (
        <img key={idx} src={img} alt={`Slide ${idx + 1}`} />
      ))}
      </div>
    </div>
  );
};

export default HeroBanner;
