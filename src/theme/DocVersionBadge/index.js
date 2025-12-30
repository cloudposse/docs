import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDocsVersion} from '@docusaurus/plugin-content-docs/client';

// Custom DocVersionBadge that can be used directly
// The default render location (after breadcrumbs) is handled by moving this
// into the breadcrumbs container instead
export default function DocVersionBadge({className}) {
  const versionMetadata = useDocsVersion();

  // Only render when explicitly given a className (i.e., when called from DocBreadcrumbs)
  // This prevents the duplicate badge that DocItem/Layout would render
  if (!className) {
    return null;
  }

  if (versionMetadata.badge) {
    return (
      <span
        className={clsx(
          className,
          ThemeClassNames.docs.docVersionBadge,
          'badge badge--secondary',
        )}>
        <Translate
          id="theme.docs.versionBadge.label"
          values={{versionLabel: versionMetadata.label}}>
          {'Version: {versionLabel}'}
        </Translate>
      </span>
    );
  }
  return null;
}
