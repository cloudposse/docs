import React from 'react';
import Mermaid from '@theme-original/Mermaid';
import * as AWSIcons from 'aws-react-icons';
import ReactDOMServer from 'react-dom/server';
import { icons as hugeIcons } from '@iconify-json/hugeicons';
import { icons as carbonIcons } from '@iconify-json/carbon';
import { iconToSVG, iconToHTML, replaceIDs, getIconData } from '@iconify/utils';

// Define the replacement map
const replacements = {
  '@PullRequest': 'hugeicons:git-pull-request',
  '@GitBranch': 'carbon:branch'
};

// Icon sets preloaded or to be loaded dynamically
const iconSets = {
  hugeicons: hugeIcons,
  carbon: carbonIcons
};

export default function MermaidWrapper(props) {

  // Preprocess the Mermaid diagram text
  const preprocessDiagram = (text) => {
    // Example: Replace @SecurityHub with an image tag
    //console.log(text);
    //console.log(AWSIcons);
    return preprocessMermaidDiagram(text);
  };

  // If the value prop exists, preprocess it
  const processedProps = props.value ? { ...props, value: preprocessDiagram(props.value) } : props;

  return (
    <>
      <Mermaid {...processedProps} />
    </>
  );
}

// Function to perform a brute force search for a matching icon
function findMatchingIcon(suffix) {
  // Convert suffix to lowercase for case-insensitive matching
  const lowerSuffix = suffix.toLowerCase();

  // Iterate over all keys in the AWSIcons object
  for (const iconName of Object.keys(AWSIcons)) {
    // Check if the icon name ends with the given suffix
    if (iconName.toLowerCase().endsWith(lowerSuffix)) {
      const IconComponent = AWSIcons[iconName];
      return ReactDOMServer.renderToStaticMarkup(<IconComponent />);
    }
  }

  // Return null if no match is found
  return null;
}

/// Function to render an Iconify icon using @iconify/utils
function renderIconifyIcon(iconName) {
  const [prefix, name] = iconName.split(':');

  // Retrieve the icon set from preloaded sets or dynamically load it
  let iconData = iconSets[prefix] ? getIconData(iconSets[prefix], name) : null;

  if (!iconData) {
    console.warn(`Icon "${iconName}" not found in the preloaded icon sets.`);
    return null;
  }

  // Render the SVG using iconToSVG and replace IDs to avoid collisions
  const renderData = iconToSVG(iconData, {
    height: 'auto',
  });

  // Generate the SVG string
  const svgString = iconToHTML(replaceIDs(renderData.body), renderData.attributes);

  return svgString;
}



// Function to preprocess the Mermaid diagram content
function preprocessMermaidDiagram(text) {
  const iconifyPlaceholderRegex = /@([A-Za-z0-9-]+:[A-Za-z0-9-]+)/g;
  const iconPlaceholderRegex = /@([A-Za-z0-9]+)/g;

  // Apply replacements
  for (const [placeholder, replacement] of Object.entries(replacements)) {
    text = text.replace(new RegExp(placeholder, 'g'), `@${replacement}`);
  }

  // First, handle Iconify icons
  text = text.replace(iconifyPlaceholderRegex, (match, iconName) => {
    const svgString = renderIconifyIcon(iconName);

    if (svgString) {
      // Replace the placeholder with an <img> tag containing the inline SVG
      return `<img src="data:image/svg+xml;utf8,${encodeURIComponent(svgString)}" alt="${iconName}" />`;
    } else {
      console.warn(`Iconify icon not found for: ${iconName}`);
      return match; // Return the original placeholder if the icon is not found
    }
  });

  // Then, handle AWS and other custom icons
  text = text.replace(iconPlaceholderRegex, (match, iconName) => {
    // Perform brute force search to find the first matching icon
    const svgString = findMatchingIcon(iconName);

    if (svgString) {
      // Replace the placeholder with an <img> tag containing the inline SVG
      return `<img src="data:image/svg+xml;utf8,${encodeURIComponent(svgString)}" alt="${iconName}" />`;
    } else {
      console.warn(`Icon not found for suffix: ${iconName}`);
      return match; // Return the original placeholder if the icon is not found
    }
  });

  return text;
}
