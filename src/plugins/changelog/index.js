/**
 * Copyright 2023 Cloud Posse, LLC
 *
 * This software is based on Docusaurus: Copyright 2022 - 2023 Facebook, Inc
 */

const path = require('path');
const fs = require('fs-extra');
const pluginContentBlog = require('@docusaurus/plugin-content-blog');
const {aliasedSitePath, docuHash, normalizeUrl} = require('@docusaurus/utils');

/**
 * @type {Record<string, {name: string, url: string,alias: string, imageURL: string}>}
 */
const authorsMap = {};

function extractCommitters(content) {
  const regex = /@(\w+)/g;

  const matches = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    matches.push(match[0]);
  }

  const updatedContent = content.replace(regex, '').trim();

  let committers = "";

  if (matches.length > 0) {
    committers += "## Commiters: \n";
    for (let i = 0; i < matches.length; i++) {
      const author = matches[i].replace('@', '');
    
      // committers += `- [@${author} ![${author}](https://github.com/${author}.png)](https://github.com/${author})}\n`;
      committers += `- [@${author}](https://github.com/${author})\n`;
    }  
  }

  return {
    committers: committers,
    updatedContent: updatedContent
  };
}

function extractPullRequests(content) {
  const regex = /\(?#(\d+)\)?/g;

  const matches = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1]);
  }

  const updatedContent = content.replace(regex, '').trim();

  let prs = "";

  if (matches.length > 0) {
    prs += "## Pull Requests: \n";
    for (let i = 0; i < matches.length; i++) {
      const pr = matches[i];
    
      prs += `- [#${pr}](https://github.com/cloudposse/terraform-aws-components/pull/${pr})\n`;
    }
  }

  return {
    prs: prs,
    updatedContent: updatedContent
  };
}

/**
 * @param {string} section
 */
function processSection(section) {
  const title = section
    .match(/\n## .*/)?.[0]
    .trim()
    .replace('## ', '');

  if (!title) {
    return null;
  }

  let content = section
    .replace(/\n## .*/, '')
    .replace(/<\/details>/, '</details>\n\n<!-- truncate -->')
    .trim();
  
  let result = extractCommitters(content);
  content = result.updatedContent;
  const committers = result.committers;

  result = extractPullRequests(content);
  content = result.updatedContent;
  const prs = result.prs;

  const date = title.match(/ \((?<date>.*)\)/)?.groups.date;

  return {
    title: title.replace(/ \(.*\)/, ''),
    content: `---
date: ${`${date}`}
---

# ${title.replace(/ \(.*\)/, '')}

${content.replace(/####/g, '##')}

${committers}
${prs}`
  };
}

/**
 * @param {import('@docusaurus/types').LoadContext} context
 * @returns {import('@docusaurus/types').Plugin}
 */
async function ChangelogPlugin(context, options) {
  const generateDir = path.join(context.siteDir, 'changelog/source');
  const blogPlugin = await pluginContentBlog.default(context, {
    ...options,
    path: generateDir,
    id: 'changelog',
    blogListComponent: '@theme/ChangelogList',
    blogPostComponent: '@theme/ChangelogPage',
  });
  const changelogPath = path.join(__dirname, '../../../tmp/components/terraform-aws-components/CHANGELOG.md');
  return {
    ...blogPlugin,
    name: 'changelog-plugin',
    async loadContent() {
      const fileContent = await fs.readFile(changelogPath, 'utf-8');
      const sections = fileContent
        .split(/(?=\n## )/)
        .map(processSection)
        .filter(Boolean);
      await Promise.all(
        sections.map((section) =>
          fs.outputFile(
            path.join(generateDir, `${section.title}.md`),
            section.content,
          ),
        ),
      );
      const authorsPath = path.join(generateDir, 'authors.json');
      await fs.outputFile(authorsPath, JSON.stringify(authorsMap, null, 2));
      const content = await blogPlugin.loadContent();
      content.blogPosts.forEach((post, index) => {
        const pageIndex = Math.floor(index / options.postsPerPage);
        post.metadata.listPageLink = normalizeUrl([
          context.baseUrl,
          options.routeBasePath,
          pageIndex === 0 ? '/' : `/page/${pageIndex + 1}`,
        ]);
      });
      return content;
    },
    configureWebpack(...args) {
      const config = blogPlugin.configureWebpack(...args);
      const pluginDataDirRoot = path.join(
        context.generatedFilesDir,
        'changelog-plugin',
        'default',
      );
      // Redirect the metadata path to our folder
      config.module.rules[0].use[1].options.metadataPath = (mdxPath) => {
        // Note that metadataPath must be the same/in-sync as
        // the path from createData for each MDX.
        const aliasedPath = aliasedSitePath(mdxPath, context.siteDir);
        return path.join(pluginDataDirRoot, `${docuHash(aliasedPath)}.json`);
      };
      return config;
    },
    getThemePath() {
      return './theme';
    },
    getPathsToWatch() {
      // Don't watch the generated dir
      return [changelogPath];
    },
  };
}

ChangelogPlugin.validateOptions = pluginContentBlog.validateOptions;

module.exports = ChangelogPlugin;
