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
      } else {
        return prev < totalSlides - 1 ? prev + 1 : prev;
      }
    });
  }, [totalSlides, loop]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      if (loop) {
        return (prev - 1 + totalSlides) % totalSlides;
      } else {
        return prev > 0 ? prev - 1 : prev;
      }
    });
  }, [totalSlides, loop]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowRight') {
      nextSlide();
    } else if (event.key === 'ArrowLeft') {
      prevSlide();
    }
  }, [nextSlide, prevSlide]);

  const updateSlideFromHash = useCallback(() => {
    const hash = window.location.hash.substring(1); // Remove the '#' from the hash

    if (hash) {
      const parts = hash.split('-');
      const slideIndex = parseInt(parts[parts.length - 1], 10) - 1; // Zero-based index
      if (!isNaN(slideIndex) && slideIndex < totalSlides) {
        setCurrentSlide(slideIndex);
      }
    }
  }, [totalSlides]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', updateSlideFromHash);
    window.addEventListener('popstate', updateSlideFromHash);

    // Initial check in case the page loads with a hash
    updateSlideFromHash();

    // Inject TOC entries
    const tocContainer = document.querySelector('.table-of-contents');
    if (tocContainer) {
      // Clear existing TOC entries to prevent duplicates
      tocContainer.innerHTML = '';

      React.Children.forEach(children, (child, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#slide-${index + 1}`; // Adjust to one-based index for the URL
        a.textContent = child.props.title || `Slide ${index + 1}`;
        a.className = 'table-of-contents__link toc-highlight'; // Use Docusaurus styles

        a.addEventListener('click', (e) => {
          e.preventDefault(); // Prevent the default scrolling behavior
          // Update the URL hash without causing the page to scroll
          history.replaceState(null, null, `#slide-${index + 1}`);
          setCurrentSlide(index); // Set the current slide without scrolling
        });

        li.appendChild(a);
        li.id = `toc-slide-${index}`; // Assign an ID to each TOC entry for easy access
        tocContainer.appendChild(li); // Append the new list item to the ToC
      });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', updateSlideFromHash);
      window.removeEventListener('popstate', updateSlideFromHash);
    };
  }, [handleKeyDown, updateSlideFromHash, children]);

  useEffect(() => {
    // Update the active state in the TOC
    const tocContainer = document.querySelector('.table-of-contents');
    if (tocContainer) {
      React.Children.forEach(children, (child, index) => {
        const tocItem = document.getElementById(`toc-slide-${index}`);
        if (tocItem) {
          const link = tocItem.querySelector('a');
          if (index === currentSlide) {
            link.classList.add('table-of-contents__link--active');
          } else {
            link.classList.remove('table-of-contents__link--active');
          }
        }
      });
    }

    const slider = document.querySelector('.slides');
    if (slider) {
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
      slider.style.transition = 'transform 0.3s ease-in-out';
    }

    // Update the active class on the slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
      if (index === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }, [currentSlide, children]);

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
      <div className="slides">
        {React.Children.map(children, (child, index) => (
          <div className="slide" id={`slide-${index + 1}`}>
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

export const Slide = ({ children, title }) => {
  return (
    <div className="slide-content">
      {children}
    </div>
  );
};

export default Slider;
