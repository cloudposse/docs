import React, { useEffect } from 'react';

export default function DefinitionLinkHandler() {
  useEffect(() => {
    // Select all <dt> elements
    const dtElements = document.querySelectorAll('dt');

    dtElements.forEach((dt) => {
      // Generate a slug based on the content of the <dt> tag
      const slug = dt.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

      // Check if the dt element already has an ID
      if (!dt.id) {
        dt.id = slug;

        // Create a hash-link anchor
        const anchor = document.createElement('a');
        anchor.href = `#${slug}`;
        anchor.className = 'hash-link';
        anchor.setAttribute('aria-label', `Direct link to ${dt.textContent}`);
        anchor.setAttribute('title', `Direct link to ${dt.textContent}`);
        anchor.innerHTML = '&ZeroWidthSpace;';

        // Append the anchor to the dt element
        dt.appendChild(anchor);
      }
    });
  }, []); // Runs once on mount

  return null; // No UI to render
}
