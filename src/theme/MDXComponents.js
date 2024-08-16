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
import DT from '@site/src/components/DT';
library.add(fab, fas, far); // Add all icons to the library so you can use them without importing them individually.

export default {
  // Re-use the default mapping
  ...MDXComponents,
  Icon: Icon, // Make the iconify Icon component available in MDX as <Icon />.
  FAIcon: FontAwesomeIcon, // Make the FontAwesomeIcon component available in MDX as <FAIcon />.
  // Add custom components
  DT: DT, // Make the DT component available in MDX as <DT />.
  CategoryList: CategoryList, // Make the CategoryList component available in MDX as <CategoryList />.
};
