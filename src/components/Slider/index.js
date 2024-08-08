import React, { useState, useEffect, useCallback, useRef } from 'react';
import './index.css'; // Ensure you have this file with the styles

const Slider = ({ children, loop = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  const totalSlides = React.Children.count(children);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      if (loop) {
        return (prev + 1) % totalSlides;
      }
      return prev < totalSlides - 1 ? prev + 1 : prev;
    });
  }, [totalSlides, loop]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      if (loop) {
        return (prev - 1 + totalSlides) % totalSlides;
      }
      return prev > 0 ? prev - 1 : prev;
    });
  }, [totalSlides, loop]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowRight') {
      nextSlide();
    } else if (event.key === 'ArrowLeft') {
      prevSlide();
    }
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      className="slider"
      tabIndex={0} // Make the slider focusable
      ref={sliderRef}
    >
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        ></div>
      </div>
      {(loop || currentSlide > 0) && (
        <button className="slider-button left" onClick={prevSlide}>❮</button>
      )}
      <div className="slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {React.Children.map(children, (child, index) => (
          <div className={`slide ${index === currentSlide ? 'active' : ''}`}>
            {child}
          </div>
        ))}
      </div>
      {(loop || currentSlide < totalSlides - 1) && (
        <button className="slider-button right" onClick={nextSlide}>❯</button>
      )}
    </div>
  );
};

export const Slide = ({ children }) => {
  return (
    <div className="slide-content">
      {children}
    </div>
  );
};

export default Slider;
