import OriginalDocBreadcrumbs from "@theme-original/DocBreadcrumbs";
import DocVersionBadge from '@theme/DocVersionBadge';
import GitHubButton from 'react-github-btn'
import React from "react";
import { useEffect, useState } from 'react';
import './index.css';

const useHtmlDataTheme = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const htmlElement = document.documentElement;

    const handleThemeChange = () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
      setTheme(currentTheme);
    };

    handleThemeChange(); // Set initial value
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(htmlElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
};

export default function DocBreadcrumbs(props) {
  const theme = useHtmlDataTheme();
  const colorScheme = theme === 'dark' ? 'dark' : 'light';
  return (
    <>
      <div className="breadcrumbs-container">
        <OriginalDocBreadcrumbs {...props} />
        <DocVersionBadge className="version-badge" />
        <div className="buttons">
          <GitHubButton data-icon="octicon-heart"
                      data-show-count="true"
                      aria-label={'Sponsor @cloudposse on GitHub'}
                      data-color-scheme={`no-preference: dark; light: light; dark: ${colorScheme};`}
                      data-size="large"
                      className="github-sponsor-button"
                      href="https://github.com/sponsors/cloudposse">Sponsor @cloudposse</GitHubButton>
        </div>
      </div>
    </>
  );
}
