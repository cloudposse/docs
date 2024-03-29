/**
 * Copyright 2023 Cloud Posse, LLC
 *
 * This software is based on Docusaurus: Copyright 2022 - 2023 Facebook, Inc
 */

// Changed the text labels.

import React from 'react';
import Translate, {translate} from '@docusaurus/Translate';
import PaginatorNavLink from '@theme/PaginatorNavLink';
import type {Props} from '@theme/BlogPostPaginator';

export default function ChangelogPaginator(props: Props): JSX.Element {
  const {nextItem, prevItem} = props;

  return (
    <nav
      className="pagination-nav docusaurus-mt-lg"
      aria-label={translate({
        id: 'theme.changelog.post.paginator.navAriaLabel',
        message: 'Changelog item navigation',
        description: 'The ARIA label for the changelog pagination',
      })}>
      {prevItem && (
        <PaginatorNavLink
          {...prevItem}
          subLabel={
            <Translate
              id="theme.changelog.post.paginator.newerRelease"
              description="The changelog button label to navigate to the newer release">
              Newer release
            </Translate>
          }
        />
      )}
      {nextItem && (
        <PaginatorNavLink
          {...nextItem}
          subLabel={
            <Translate
              id="theme.changelog.post.paginator.olderRelease"
              description="The changelog button label to navigate to the older release">
              Older release
            </Translate>
          }
          isNext
        />
      )}
    </nav>
  );
}
