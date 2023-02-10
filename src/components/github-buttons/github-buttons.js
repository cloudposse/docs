import React from "react";
import GitHubButton from 'react-github-btn'

export default function GitHubButtons({custom_edit_url}) {
  if (custom_edit_url == undefined) {
    return (<div/>);
  } else {
    const url = new URL(custom_edit_url.replace('/blob/', '/tree/'));

    let parts = url.pathname.split('/');
    parts.shift();
    let repoFullName = parts[0] + '/' + parts[1];

    parts.pop();
    const componentFolderPath = parts.join('/');

    return (
      <div className="github_buttons">
        <ul>
          <li>
            <GitHubButton
              href={'https://github.com/' + componentFolderPath}
              aria-label="Open GitHub">GitHub</GitHubButton>
          </li>

          <li>
            <GitHubButton
              href={'https://github.com/' + repoFullName + '/issues'}
              data-show-count="true"
              aria-label={'Issue ' + repoFullName + ' on GitHub'}>Issues</GitHubButton>
          </li>

          <li>
            <GitHubButton
              href={'https://github.com/' + repoFullName + '/fork'}
              data-icon="octicon-repo-forked"
              data-show-count="true"
              aria-label={'Fork ' + repoFullName + ' on GitHub'}>Forks</GitHubButton>
          </li>

          <li>
            <GitHubButton
              href={'https://github.com/' + repoFullName}
              data-icon="octicon-star"
              data-show-count="true"
              aria-label={'Star ' + repoFullName + ' on GitHub'}>Stars</GitHubButton>
          </li>
        </ul>
      </div>);
    }
}
