import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesomeIcon component.
import { library } from '@fortawesome/fontawesome-svg-core'; // Import the library component.
import { fab } from '@fortawesome/free-brands-svg-icons'; // Import all brands icons.
import { fas } from '@fortawesome/free-solid-svg-icons'; // Import all solid icons.
import { far } from '@fortawesome/free-regular-svg-icons'; // Import all regular icons.
import { Icon } from '@iconify/react'; // Import the entire Iconify library.
// Import custom components
import CategoryList from '@site/src/components/CategoryList';

library.add(fab, fas, far); // Add all icons to the library so you can use them without importing them individually.

// Custom list components with Tailwind classes to restore styling removed by Preflight
function Ul({ children, ...props }) {
  return (
    <ul className="list-disc pl-8 my-4" {...props}>
      {children}
    </ul>
  );
}

function Ol({ children, ...props }) {
  return (
    <ol className="list-decimal pl-8 my-4" {...props}>
      {children}
    </ol>
  );
}

function Li({ children, ...props }) {
  return (
    <li className="my-1" {...props}>
      {children}
    </li>
  );
}

export default {
  // Re-use the default mapping
  ...MDXComponents,
  Icon: Icon, // Make the iconify Icon component available in MDX as <Icon />.
  FAIcon: FontAwesomeIcon, // Make the FontAwesomeIcon component available in MDX as <FAIcon />.
  // Add custom components
  CategoryList: CategoryList, // Make the CategoryList component available in MDX as <CategoryList />.
  // Override HTML elements with Tailwind-styled versions
  ul: Ul,
  ol: Ol,
  li: Li,
};
