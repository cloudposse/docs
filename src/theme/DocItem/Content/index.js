import React, { useEffect } from 'react';
import OriginalDocItemContent from '@theme-original/DocItem/Content';
import GitHubButtons from '../../../components/github-buttons/github-buttons';
import { Icon } from '@iconify/react';
import useGlobalData from '@docusaurus/useGlobalData';
import {useLocation} from '@docusaurus/router';
import { createRoot } from 'react-dom/client';

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

const DocItemContent = ({ children }) => {
  const custom_edit_url = children.type.frontMatter.custom_edit_url;
  const {pathname} = useLocation();
  const href = pathname.replace(/\/+$/, '')
  const globalData = useGlobalData();
  const globalMetadata = globalData.metadata.default.aggregateMetadata;
  const metadata = findPermalink(globalMetadata, href);


  // Define the hasTopic function
  const hasTopic = (topic) => {
    const tags = metadata?.frontMatter?.tags || [];
    const class_name = metadata?.frontMatter?.sidebar_class_name || '';
    return tags.includes(topic) || new RegExp(topic).test(class_name) || new RegExp(topic).test(href);
  };

  useEffect(() => {
    var icon;
    // Define a map of topics to icons
    const topicIcons = {
      'deprecated': 'ph:warning-duotone',
      'terraform': 'devicon:terraform',
      'tutorial': 'arcticons:quicknovel',
      'how-to': 'arcticons:quicknovel',
      'design-decision': 'carbon:decision-node',
      'faq': 'wpf:faq',
      'eks': 'logos:aws-eks',
      'ecs': 'logos:aws-ecs',
      'aws': 'skill-icons:aws-dark',
      'dns': 'logos:aws-route53',
      'setup': 'ep:set-up',
      'contact': 'streamline:send-email',
      'discuss': 'octicon:comment-discussion-24',
      'support': 'ic:twotone-contact-support',
      'makefile': 'vscode-icons:file-type-makefile',
      'editor-?config': 'file-icons:editorconfig',
      'markdown': 'skill-icons:markdown-dark',
      'tool': 'entypo:tools',
      'legacy': 'ph:warning-duotone',
      'docker': 'skill-icons:docker',
      'datadog': 'vscode-icons:file-type-datadog',
      'data': 'solar:database-line-duotone',
      'github-actions': 'skill-icons:githubactions-dark',
      'argocd': 'devicon:argocd-wordmark',
      'opsgenie': 'logos:opsgenie',
      'github': 'ph:github-logo-duotone',
      'atmos': 'fluent-emoji:alien',
      'network': 'logos:aws-vpc',
      'route53': 'logos:aws-route53',
      'idenity': 'logos:aws-iam',
      'iam': 'logos:aws-iam',
      'aws-backup': 'logos:aws-backup',
      'cloudtrail': 'logos:aws-cloudtrail',
      'cloudwatch': 'logos:aws-cloudwatch',
      'api-gateway': 'logos:aws-api-gateway',
      'dynamodb': 'logos:aws-dynamodb',
      'compliance': 'grommet-icons:compliance',
      'slack': 'arcticons:slack',
      'community': 'iconoir:community',
      'adr': 'material-symbols-light:notes',
      'startup': 'noto:rocket',
      'enterprise': 'material-symbols-light:corporate-fare-rounded',
      'exercise': 'streamline:class-lesson',
      'action': 'fluent-mdl2:set-action',
      'onboard': 'fluent-mdl2:onboarding',
      'prereq': 'carbon:column-dependency',
      'repo': 'mdi:source-repository',
      'software-delivery': 'carbon:ai-governance-lifecycle',
      'gitops': 'clarity:deploy-line',
      'glossary': 'material-symbols-light:dictionary-outline',
      'diagram': 'simple-icons:diagramsdotnet',
      '1password': 'mdi:1password',
      'quickstart': 'ph:lightning-duotone',
      'jumpstart': 'file-icons:powerbuilder',
      'stack': 'ph:stack-duotone',
      'component': 'icon-park-twotone:puzzle'
    };

    if( metadata && metadata.frontMatter?.icon ) {
      icon = metadata.frontMatter.icon;
    } else {
      // Iterate over the topics to icons map
      for (const [topic, topicIcon] of Object.entries(topicIcons)) {
        if (hasTopic(topic)) {
          icon = topicIcon;
          break;
        }
      }
    }

    if (icon) {
      const firstHeader = document.querySelector('article header');
      if (firstHeader && !firstHeader.querySelector('.icon')) {
        const iconWrapper = document.createElement('span');
        firstHeader.prepend(iconWrapper);

        const iconElement = (
          <Icon icon={icon} height="150" className="icon" />
        );

        // Render the icon using React into the created span
        const root = createRoot(iconWrapper);
        root.render(iconElement);
      }
    }
  }, []);

  return (
    <>
      <GitHubButtons custom_edit_url={custom_edit_url} />
      <OriginalDocItemContent>{children}</OriginalDocItemContent>
    </>
  );
};

export default DocItemContent;
