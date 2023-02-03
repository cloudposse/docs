import OriginalDocBreadcrumbs from "@theme-original/DocBreadcrumbs";
import React from "react";

export default function DocBreadcrumbs(props) {
  return (
    <>
      <div class="breadcrumbs-container">
        <OriginalDocBreadcrumbs {...props} />
        <iframe src="https://slack.cloudposse.com/iframe" class="slack-in-breadcrumbs"></iframe>
      </div>
    </>
  );
}
