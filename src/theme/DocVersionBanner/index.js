import React from 'react';
import Link from '@docusaurus/Link';
import {useDocsVersion} from '@docusaurus/plugin-content-docs/client';
import Admonition from '@theme/Admonition';

export default function DocVersionBanner() {
  const versionMetadata = useDocsVersion();

  // Latest/current version - green tip admonition
  // Check for isLast OR version === 'current' (unreleased but still the latest)
  const isLatestVersion = versionMetadata.isLast || versionMetadata.version === 'current';

  if (isLatestVersion) {
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

  // Older version - yellow warning admonition
  return (
    <div className="margin-bottom--md">
      <Admonition type="warning" title={`Version ${versionMetadata.label} Documentation`}>
        This is Version {versionMetadata.label} documentation for the Cloud Posse Reference Architecture.
        To determine which version you're using, please see{' '}
        <Link to="/resources/version-identification/">Version Identification</Link>.
        To understand why this version changed, please see the{' '}
        <Link to="/blog/deprecate-account-map/">blog post</Link>.
      </Admonition>
    </div>
  );
}
