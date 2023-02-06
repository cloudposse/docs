import {useDoc} from '@docusaurus/theme-common/internal';

import React from "react";
import OriginalDocItemTOCDesktop from "@theme-original/DocItem/TOC/Desktop";
import TOC from '@theme/TOC';
import {ThemeClassNames} from '@docusaurus/theme-common';

export default function DocItemTOCDesktop() {
  const {toc, frontMatter} = useDoc();
  return (
    <TOC
      toc={toc}
      frontMatter={frontMatter}
      minHeadingLevel={frontMatter.toc_min_heading_level}
      maxHeadingLevel={frontMatter.toc_max_heading_level}
      className={ThemeClassNames.docs.docTocDesktop}
    />
  );
}
