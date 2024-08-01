import React from 'react';
import Layout from '@theme-original/Layout';
import KeyboardShortcuts from '@site/src/components/KeyboardShortcuts';

export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props} />
      <KeyboardShortcuts />
    </>
  );
}
