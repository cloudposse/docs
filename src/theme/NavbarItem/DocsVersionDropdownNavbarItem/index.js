/**
 * Swizzled DocsVersionDropdownNavbarItem to fix a Docusaurus bug where the
 * dropdown shows "Latest" even when viewing an older version like v1.
 *
 * The fix: use activeDocContext.activeVersion instead of useDocsVersionCandidates()
 * for the dropdown label, so it reflects the currently viewed version.
 *
 * Original source: @docusaurus/theme-classic/lib/theme/NavbarItem/DocsVersionDropdownNavbarItem.js
 */
import React from 'react';
import {
  useVersions,
  useActiveDocContext,
} from '@docusaurus/plugin-content-docs/client';
import {useDocsPreferredVersion} from '@docusaurus/theme-common';
import {useDocsVersionCandidates} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import {useLocation} from '@docusaurus/router';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';

const getVersionMainDoc = (version) =>
  version.docs.find((doc) => doc.id === version.mainDocId);

export default function DocsVersionDropdownNavbarItem({
  mobile,
  docsPluginId,
  dropdownActiveClassDisabled,
  dropdownItemsBefore = [],
  dropdownItemsAfter = [],
  ...props
}) {
  const {search, hash, pathname} = useLocation();
  const activeDocContext = useActiveDocContext(docsPluginId);
  const versions = useVersions(docsPluginId);

  // FIX: Detect version from URL path since activeDocContext.activeVersion is unreliable
  // This mirrors the approach used in DocVersionBanner
  const isV1Path = pathname.startsWith('/v1/') || pathname === '/v1';
  const urlDetectedVersion = isV1Path
    ? versions.find((v) => v.name === 'v1')
    : versions.find((v) => v.name === 'current');

  const {savePreferredVersionName} = useDocsPreferredVersion(docsPluginId);
  const versionLinks = versions.map((version) => {
    // We try to link to the same doc, in another version
    // When not possible, fallback to the "main doc" of the version
    const versionDoc =
      activeDocContext.alternateDocVersions[version.name] ??
      getVersionMainDoc(version);
    return {
      label: version.label,
      // preserve ?search#hash suffix on version switches
      to: `${versionDoc.path}${search}${hash}`,
      isActive: () => version === activeDocContext.activeVersion,
      onClick: () => savePreferredVersionName(version.name),
    };
  });
  const items = [
    ...dropdownItemsBefore,
    ...versionLinks,
    ...dropdownItemsAfter,
  ];
  const dropdownVersion = useDocsVersionCandidates(docsPluginId)[0];

  // FIX: Use URL-detected version since activeDocContext.activeVersion is unreliable
  // Fall back to dropdownVersion (candidate) for non-docs pages
  const displayVersion = urlDetectedVersion ?? dropdownVersion;

  // Mobile dropdown is handled a bit differently
  const dropdownLabel =
    mobile && items.length > 1
      ? translate({
          id: 'theme.navbar.mobileVersionsDropdown.label',
          message: 'Versions',
          description:
            'The label for the navbar versions dropdown on mobile view',
        })
      : displayVersion.label;
  const dropdownTo =
    mobile && items.length > 1
      ? undefined
      : getVersionMainDoc(displayVersion).path;
  // We don't want to render a version dropdown with 0 or 1 item. If we build
  // the site with a single docs version (onlyIncludeVersions: ['1.0.0']),
  // We'd rather render a button instead of a dropdown
  if (items.length <= 1) {
    return (
      <DefaultNavbarItem
        {...props}
        mobile={mobile}
        label={dropdownLabel}
        to={dropdownTo}
        isActive={dropdownActiveClassDisabled ? () => false : undefined}
      />
    );
  }
  return (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      label={dropdownLabel}
      to={dropdownTo}
      items={items}
      isActive={dropdownActiveClassDisabled ? () => false : undefined}
    />
  );
}
