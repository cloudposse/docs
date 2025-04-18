import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import './index.css';

const PrimaryCTA = ({ to, label, children }) => {
  const [expanded, setExpanded] = useState(false);

  return to ? (
    <Link to={to} className="button button--lg button--primary">
      {label || children}
    </Link>
  ) : (
    <div
      className="relative flex flex-col items-start"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <button
        className={clsx(
          "button button--lg button--primary",
          expanded && "opacity-35 cursor-not-allowed"
        )}
      >
        {label}
      </button>
      <div
        className={clsx(
          "transition-all duration-300 ease-in-out",
          expanded ? "opacity-100 mt-2" : "max-h-0 opacity-0"
        )}
      >
        <div className="prose prose-sm text-md [&>ul]:m-0 [&>ul>li]:relative [&>ul>li]:flex [&>ul>li]:items-center [&>ul>li]:before:content-['›'] [&>ul>li]:before:text-xl [&>ul>li]:before:text-gray-300 [&>ul>li]:before:opacity-0 [&>ul>li:hover]:before:opacity-100 [&>ul>li:hover]:before:text-gray-100 [&>ul>li]:before:mr-1 [&>ul>li>a]:no-underline [&>ul>li>a:hover]:no-underline!">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PrimaryCTA;
