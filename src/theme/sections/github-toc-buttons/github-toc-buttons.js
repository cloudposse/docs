import React from "react";
import GitHubButton from 'react-github-btn'

export default function GitHubButtons({custom_edit_url}) {
  if (custom_edit_url == undefined) {
    return (<div/>);
  } else {
    const url = new URL(custom_edit_url);
    const parts = url.pathname.split('/');

    let repoFullName = parts[1] + '/' + parts[2];

    return (
      <div className="github_buttons">
        <ul>
          <li>
            <GitHubButton
              href={'https://github.com/' + repoFullName}
              data-size="large"
              aria-label="Open GitHub">GitHub</GitHubButton>
          </li>

          <li>
            <GitHubButton
              href={'https://github.com/' + repoFullName + '/issues'}
              data-size="large"
              data-show-count="true"
              aria-label="Issue cloudposse/terraform-aws-components on GitHub">Issues</GitHubButton>
          </li>

          <li>
            <GitHubButton
              href={'https://github.com/' + repoFullName + '/fork'}
              data-icon="octicon-repo-forked"
              data-size="large"
              data-show-count="true"
              aria-label="Fork cloudposse/terraform-aws-components on GitHub">Forks</GitHubButton>
          </li>

          <li>
            <GitHubButton
              href={'https://github.com/' + repoFullName}
              data-icon="octicon-star"
              data-size="large"
              data-show-count="true"
              aria-label="Star buttons/github-buttons on GitHub">Stars</GitHubButton>
          </li>
        </ul>
      </div>);
    }
}
