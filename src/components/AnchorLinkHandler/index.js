import React, { useEffect } from 'react';

export default function AnchorLinkHandler() {
  useEffect(() => {
    const adjustScrollPosition = () => {
      const navbar = document.querySelector('nav.navbar');
      const navbarHeight = navbar ? navbar.getBoundingClientRect().bottom : 0;

      const element = document.getElementById(window.location.hash.substring(1));
      if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    const handlePageLoad = () => {
      setTimeout(() => {
        if (window.location.hash) {
          adjustScrollPosition();
        }
      }, 100); // Delay to ensure content is ready
    };

    window.addEventListener('hashchange', adjustScrollPosition);
    window.addEventListener('load', handlePageLoad);

    return () => {
      window.removeEventListener('hashchange', adjustScrollPosition);
      window.removeEventListener('load', handlePageLoad);
    };
  }, []); // Runs once on mount

  return null; // No UI to render
}
