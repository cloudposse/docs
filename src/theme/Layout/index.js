import React from 'react';
import Layout from '@theme-original/Layout';
import KeyboardShortcuts from '@site/src/components/KeyboardShortcuts';
import DefinitionLinkHandler from '@site/src/components/DefinitionLinkHandler';
import AnchorLinkHandler from '@site/src/components/AnchorLinkHandler';

export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props} />
      <KeyboardShortcuts />
      <DefinitionLinkHandler />
      <AnchorLinkHandler />
    </>
  );
}
