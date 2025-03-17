import React from 'react'
import Link from '@docusaurus/Link'
import PrimaryCTA from '@site/src/components/PrimaryCTA'
import SecondaryCTA from '@site/src/components/SecondaryCTA'
import { useLocation } from 'react-router-dom'
import { useActivePluginAndVersion, useActiveDocContext } from '@docusaurus/plugin-content-docs/client'
import './index.css'

const ActionCard = ({ title = "Ready to learn this topic?",
                      ctaText,
                      ctaLink,
                      primaryCtaText,
                      primaryCtaLink,
                      secondaryCtaText,
                      secondaryCtaLink,
                      children }) => {

  const location = useLocation();
  const { activePlugin, activeVersion } = useActivePluginAndVersion();
  const { activeDoc } = useActiveDocContext();

  // Function to find the next document based on front matter pagination
  const findNextDoc = () => {
    if (!activeDoc || !activeDoc.frontMatter) {
      return null;
    }

    const { pagination_next: nextDocId } = activeDoc.frontMatter;

    if (nextDocId) {
      const nextDoc = activePlugin.content.docs.find(doc => doc.id === nextDocId);
      return nextDoc ? nextDoc.permalink : null;
    }

    return null;
  };

  // Determine primary CTA text and link
  const primaryText = ctaText || primaryCtaText || "Next";
  const primaryLink = ctaLink || primaryCtaLink || findNextDoc();

  return (
    <div className="action-card">
      <h2>{title}</h2>
      <div className="block">{children}</div>
      {primaryLink && (
        <PrimaryCTA to={primaryLink}>
          {primaryText}
        </PrimaryCTA>
      )}
      {secondaryCtaLink && (
        <SecondaryCTA to={secondaryCtaLink}>
          {secondaryCtaText || "Read More"}
        </SecondaryCTA>
      )}
    </div>
  );
};

export default ActionCard;
