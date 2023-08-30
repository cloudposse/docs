/**
 * Copyright 2023 Cloud Posse, LLC
 *
 * This software is based on Docusaurus: Copyright 2022 - 2023 Facebook, Inc
 */

import React from 'react';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

function RssLink() {
  return (
    <Link href="pathname:///components/changelog/rss.xml" className={styles.rss}>
      <b>
        <Translate id="changelog.description.rssLink">RSS feeds</Translate>
      </b>
      <svg
        style={{
          fill: '#f26522',
          position: 'relative',
          left: 4,
          top: 1,
          marginRight: 8,
        }}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24">
        <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z" />
      </svg>
    </Link>
  );
}

export default function ChangelogListHeader({
  blogTitle,
}: {
  blogTitle: string;
}): JSX.Element {
  return (
    <header className="margin-bottom--lg">
      <h1 style={{fontSize: '3rem'}}>{blogTitle}</h1>
      <p>
        <Translate
          id="changelog.description"
          values={{
            rssLink: <RssLink />,
          }}>
          {
            'Subscribe through {rssLink} to stay up-to-date with new releases!'
          }
        </Translate>
      </p>
    </header>
  );
}
