import React, { useState, useEffect, useCallback, useRef } from 'react';
import './index.css';

/**
 * Slide component for individual slides within a Slides container.
 * Used as children of the Slides component.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The MDX content for this slide
 * @param {string} [props.title] - Optional title shown in TOC navigation
 * @param {string} [props.notes] - Optional speaker notes/explanation shown below the slide
 * @param {boolean} [props.showNotes] - Whether to show the notes panel
 * @param {string} [props.variant] - Optional variant: "title" for centered title slides
 */
export const Slide = ({ children, title, notes, showNotes = true, variant }) => {
  const innerClasses = `slides-slide-inner ${variant === 'title' ? 'slides-slide-title' : ''}`;
  return (
    <div className={`slides-slide-content ${!showNotes ? 'slides-notes-hidden' : ''}`}>
      <div className="slides-slide-main">
        <div className={innerClasses}>
          {children}
        </div>
      </div>
      {notes && showNotes && (
        <div className="slides-slide-notes">
          {notes}
        </div>
      )}
    </div>
  );
};

/**
 * Slides component that displays MDX-based slide presentations.
 * Supports four modes:
 * 1. MDX slides - When children (Slide components) are provided
 * 2. Google Slides embed - When googleSlidesUrl is provided
 * 3. Video embed - When videoUrl is provided (legacy video content)
 * 4. Placeholder - When only title/description provided (coming soon)
 *
 * @param {Object} props
 * @param {string} props.title - Title of the presentation
 * @param {string} [props.description] - Description shown in placeholder mode
 * @param {string} [props.googleSlidesUrl] - URL to embed Google Slides
 * @param {string} [props.videoUrl] - URL to embed a video (legacy content)
 * @param {React.ReactNode} [props.children] - Slide components for MDX mode
 */
const Slides = ({
  title,
  description,
  googleSlidesUrl,
  videoUrl,
  children,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const slidesRef = useRef(null);

  // Get array of slide children
  const slideChildren = React.Children.toArray(children).filter(
    child => React.isValidElement(child)
  );
  const totalSlides = slideChildren.length;
  const hasSlides = totalSlides > 0;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      slidesRef.current?.requestFullscreen();
      setIsFullscreen(true);
      setIsTheater(false);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const toggleTheater = useCallback(() => {
    if (isFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    setIsTheater(prev => !prev);
  }, [isFullscreen]);

  const toggleNotes = useCallback(() => {
    setShowNotes(prev => !prev);
  }, []);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowRight' || event.key === ' ') {
      event.preventDefault();
      nextSlide();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prevSlide();
    } else if (event.key === 'Escape') {
      if (isFullscreen) {
        setIsFullscreen(false);
      } else if (isTheater) {
        setIsTheater(false);
      }
    } else if (event.key === 'f' || event.key === 'F') {
      event.preventDefault();
      toggleFullscreen();
    } else if (event.key === 't' || event.key === 'T') {
      event.preventDefault();
      toggleTheater();
    } else if (event.key === 'n' || event.key === 'N') {
      event.preventDefault();
      toggleNotes();
    }
  }, [nextSlide, prevSlide, isFullscreen, isTheater, toggleFullscreen, toggleTheater, toggleNotes]);

  useEffect(() => {
    const slidesEl = slidesRef.current;
    if (slidesEl) {
      slidesEl.addEventListener('keydown', handleKeyDown);
      return () => slidesEl.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Mode 1: MDX-based slides with children
  if (hasSlides) {
    const containerClass = `slides-container slides-interactive ${isFullscreen ? 'slides-fullscreen' : ''} ${isTheater ? 'slides-theater' : ''}`;

    return (
      <figure className={containerClass} ref={slidesRef} tabIndex={0}>
        {/* Header with title */}
        {title && <figcaption className="slides-header">{title}</figcaption>}

        {/* Progress bar */}
        <div className="slides-progress-bar">
          <div
            className="slides-progress"
            style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          />
        </div>

        {/* Slides viewport */}
        <div className="slides-viewport">
          <div
            className="slides-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slideChildren.map((child, index) => (
              <div
                key={index}
                className={`slides-slide ${index === currentSlide ? 'active' : ''}`}
              >
                {React.cloneElement(child, { showNotes })}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="slides-controls">
          {/* Navigation and dots row */}
          <div className="slides-nav-row">
            <button
              className="slides-nav-button"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              aria-label="Previous slide"
              title="Previous slide"
            >
              ❮
            </button>
            <div className="slides-dots">
              {slideChildren.map((child, index) => (
                <button
                  key={index}
                  className={`slides-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}${child.props.title ? `: ${child.props.title}` : ''}`}
                  title={child.props.title || `Slide ${index + 1}`}
                />
              ))}
            </div>
            <button
              className="slides-nav-button"
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              aria-label="Next slide"
              title="Next slide"
            >
              ❯
            </button>
          </div>

          {/* View options */}
          <div className="slides-controls-row">
            <div className="slides-view-options">
              <button
                className={`slides-view-button ${showNotes ? 'active' : ''}`}
                onClick={toggleNotes}
                aria-label={showNotes ? 'Hide notes' : 'Show notes'}
                title={showNotes ? 'Hide notes (N)' : 'Show notes (N)'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"/>
                </svg>
              </button>
              <button
                className={`slides-view-button ${isTheater ? 'active' : ''}`}
                onClick={toggleTheater}
                aria-label={isTheater ? 'Exit theater mode' : 'Theater mode'}
                title={isTheater ? 'Exit theater mode (T)' : 'Theater mode (T)'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.89 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"/>
                </svg>
              </button>
              <button
                className={`slides-view-button ${isFullscreen ? 'active' : ''}`}
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                title={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}
              >
                {isFullscreen ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </figure>
    );
  }

  // Mode 2: Google Slides embed
  if (googleSlidesUrl) {
    return (
      <figure className="slides-container">
        <iframe
          src={googleSlidesUrl}
          className="slides-iframe"
          frameBorder="0"
          allowFullScreen
          title={title}
        />
        {title && <figcaption>{title}</figcaption>}
      </figure>
    );
  }

  // Mode 3: Video embed (legacy content)
  if (videoUrl) {
    return (
      <figure className="slides-container slides-video">
        <video
          controls
          className="slides-video-player"
          title={title}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <figcaption>AI generated voice</figcaption>
      </figure>
    );
  }

  // Mode 4: Placeholder (coming soon)
  return (
    <figure className="slides-container">
      <div className="slides-placeholder">
        <div className="slides-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            <rect x="7" y="12" width="3" height="5"/>
            <rect x="11" y="9" width="3" height="8"/>
            <rect x="15" y="14" width="3" height="3"/>
          </svg>
        </div>
        <h4 className="slides-title">{title}</h4>
        {description && <p className="slides-description">{description}</p>}
        <span className="slides-badge">Slide Deck Coming Soon</span>
      </div>
    </figure>
  );
};

export default Slides;
