import OriginalTOC from "@theme-original/TOC";
import React from "react";
import LinkRightArrow from "../../components/link-right-arrow/link-right-arrow";
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import styles from './styles.module.css';
import GitHubButtons from '../sections/github-toc-buttons/github-toc-buttons'
const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';

export default function TOC({className, ...props}) {
  const custom_edit_url = props.frontMatter.custom_edit_url;

  return (
    <div className={clsx(styles.tableOfContents, 'thin-scrollbar', className)}>
      <TOCItems
        {...props}
        linkClassName={LINK_CLASS_NAME}
        linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
      />

      <GitHubButtons custom_edit_url={custom_edit_url}/>
    </div>
  );
}
