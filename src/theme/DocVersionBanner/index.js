import React from 'react';
import Link from '@docusaurus/Link';
import {useActiveDocContext} from '@docusaurus/plugin-content-docs/client';
import Admonition from '@theme/Admonition';

export default function DocVersionBanner() {
  const {activeVersion} = useActiveDocContext();

  // No banner needed if version info is not available
  if (!activeVersion) {
    return null;
  }

  const {label, isLast} = activeVersion;

  // Latest version (v2) - green tip admonition
  if (isLast) {
    return (
      <div className="margin-bottom--md">
        <Admonition type="tip" title="Latest Documentation">
          This is the latest documentation for the Cloud Posse Reference Architecture.
          To determine which version you're currently using, please see{' '}
          <Link to="/resources/version-identification/">Version Identification</Link>.
        </Admonition>
      </div>
    );
  }

  // v1 version - yellow warning admonition
  if (label === 'v1') {
    return (
      <div className="margin-bottom--md">
        <Admonition type="warning" title="Version 1 Documentation">
          This is Version 1 documentation for the Cloud Posse Reference Architecture.
          To determine which version you're using, please see{' '}
          <Link to="/resources/version-identification/">Version Identification</Link>.
          To understand why this version changed, please see the{' '}
          <Link to="/blog/deprecate-account-map/">blog post</Link>.
        </Admonition>
      </div>
    );
  }

  // Fallback for any other versions
  return (
    <div className="margin-bottom--md">
      <Admonition type="info" title={`Version ${label} Documentation`}>
        This is {label} documentation for the Cloud Posse Reference Architecture.
        To determine which version you're using, please see{' '}
        <Link to="/resources/version-identification/">Version Identification</Link>.
      </Admonition>
    </div>
  );
}
