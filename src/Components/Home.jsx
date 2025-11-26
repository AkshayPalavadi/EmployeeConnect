import { useState, useEffect } from "react";
import img1 from "../assets/Dhatvi.png";
import img2 from "../assets/Dhatvi1.jpeg";
import img3 from "../assets/Dhatvi2.jpg";
import img4 from "../assets/Dhatvi4.png";
import logo from "../assets/logo.jpg"

import "./Home.css";

// Images array with individual width and height
const images = [
  { src: img1, width: 1000, height: 500 },
  { src: img2, width: 1000, height: 500 },
  { src: img3, width: 1000, height: 500 },
  // { src: img4, width: 900, height: 500 },
];

export default function Home() {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => setCurrent(current === 0 ? images.length - 1 : current - 1);
  const nextSlide = () => setCurrent((current + 1) % images.length);
  const goToSlide = (index) => setCurrent(index);

  return (
    <div className="home-container">
      {/* Scrolling Text */}
      <div className="scrolling-text">
        <div className="scrolling-content">
          <img src={logo} alt="Logo" className="scroll-logo"/>
          <div className="title">
            <p>Dhatvi Business Solutions Pvt.Ltd.</p>
            <p className="tagline"><i>Driving Technology, Delivering Trust</i></p>
          </div>
        </div>
      </div> 

      {/* Carousel */}
      <div className="images">
        {/* Arrows */}
        {/* <span className="arrow arrow-left" onClick={prevSlide}>&#10094;</span>
        <span className="arrow arrow-right" onClick={nextSlide}>&#10095;</span> */}

        <div className="image-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {images.map((img, index) => (
            <div className="image-slide" key={index}>
              <img
                src={img.src}
                alt={`slide-${index}`}
                style={{ width: `${img.width}px`, height: `${img.height}px`, objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}