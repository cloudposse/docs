import React from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import Admonition from '@theme/Admonition';

export default function DocVersionBanner() {
  const location = useLocation();
  const pathname = location.pathname;

  // Check if we're on a v1 page by looking at the URL path
  const isV1 = pathname.startsWith('/v1/') || pathname === '/v1';

  // v1 version - yellow warning admonition
  if (isV1) {
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

  // Latest/current version - green tip admonition
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
