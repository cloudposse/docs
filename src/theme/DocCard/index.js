import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useGlobalData from '@docusaurus/useGlobalData';
import {
  findFirstSidebarItemLink,
  useDocById,
} from '@docusaurus/plugin-content-docs/client';
import {usePluralForm} from '@docusaurus/theme-common';
import isInternalUrl from '@docusaurus/isInternalUrl';
import {translate} from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import { Icon } from '@iconify/react';
const { Remarkable } = require('remarkable')

function useCategoryItemsPlural() {
  const {selectMessage} = usePluralForm();
  return (count) =>
    selectMessage(
      count,
      translate(
        {
          message: '1 item|{count} items',
          id: 'theme.docs.DocCard.categoryDescription.plurals',
          description:
            'The default description for a category card in the generated index about how many items this category includes',
        },
        {count},
      ),
    );
}

function CardContainer({href, children}) {
  return (
    <Link
      href={href}
      className={clsx('card padding--lg', styles.cardContainer)}>
      {children}
    </Link>
  );
}

function CardLayout({href, icon, title, description}) {
  const md = new Remarkable();
  // Override the paragraph rule to not wrap text in <p> tags
  md.renderer.rules.paragraph_open = () => '';
  md.renderer.rules.paragraph_close = () => '';

  return (
    <CardContainer href={href}>
      <Heading
        as="h2"
        className={clsx('text--truncate', styles.cardTitle)}
        title={title}>
        <span className={clsx(styles.icon)}><Icon icon={icon} height="24" /></span>

        <span dangerouslySetInnerHTML={{__html: md.render(title)}} />
      </Heading>
      {description && (
        <p
          className={clsx('text--truncate', styles.cardDescription)}
          title={description}
          dangerouslySetInnerHTML={{ __html: md.render(description) }}/>
      )}
    </CardContainer>
  );
}

const findPermalink = (items, permalink) => {
  // Filter documents that have all the specified permalink
  const filteredItems = items.filter(doc =>
    doc.permalink === permalink
  );
  if (filteredItems.length === 0) {
    return null;
  }
  return filteredItems[0];
}

function CardCategory({item}) {
  const href = findFirstSidebarItemLink(item);
  const categoryItemsPlural = useCategoryItemsPlural();

  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }

  const globalData = useGlobalData();
  const globalMetadata = globalData.metadata.default.aggregateMetadata;
  const category = findPermalink(globalMetadata, href);
  //console.log(category);

  // Doc description is not used
  // https://github.com/facebook/docusaurus/issues/7598
  return (
    <CardLayout
      href={href}
      icon="🗃️"
      title={`${item.label} (${item.items.length})`}
      description={item.description ?? category?.description ?? categoryItemsPlural(item.items.length)}
    />
  );
}

function CardLink({item}) {
  const globalData = useGlobalData();
  const globalMetadata = globalData.metadata.default.aggregateMetadata;
  const metadata = findPermalink(globalMetadata, item.href);
  const icon = isInternalUrl(item.href) ? 'solar:document-line-duotone' : 'solar:link-bold-duotone';
  const doc = useDocById(item.docId ?? undefined);
  //console.log(metadata)
  return (
    <CardLayout
      href={item.href}
      icon={icon}
      title={item.label}
      description={item.description ?? doc?.description}
    />
  );
}

export default function DocCard({item}) {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
