import OriginalDocItemContent from "@theme-original/DocItem/Content";
import React from "react";
import GitHubButtons from '../../../components/github-buttons/github-buttons'

export default function DocItemContent({children}) {
  const custom_edit_url = children.type.frontMatter.custom_edit_url;

  return (
    <>
      <GitHubButtons custom_edit_url={custom_edit_url}/>
      <OriginalDocItemContent children={children}/>
    </>
  );
}
