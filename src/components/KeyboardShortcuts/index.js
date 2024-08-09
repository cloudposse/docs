// src/components/KeyboardShortcuts.js
import React, { useEffect } from 'react';

const KeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid intercepting Command + Arrow Key combinations
      if (e.metaKey) {
        return;
      }

      // Check for the presence of a slider
      const sliderElements = document.getElementsByClassName('slider');
      for (let i = 0; i < sliderElements.length; i++) {
        console.log('Slider detected, skipping keyboard shortcuts');
        return;
      }

      if (e.key === 'ArrowLeft') {
        const buttons = document.getElementsByClassName('pagination-nav__link');
        if (buttons.length >= 1) {
          buttons[0].click();
        }
      } else if (e.key === 'ArrowRight') {
        const buttons = document.getElementsByClassName('pagination-nav__link');
        if (buttons.length >= 2) {
          buttons[1].click();
        } else if (buttons.length >= 1) {
          buttons[0].click();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
};

export default KeyboardShortcuts;
