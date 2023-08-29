// @ts-check
const { redirects } = require("./redirects");
const lightCodeTheme = require('prism-react-renderer/themes/vsDark');
const darkCodeTheme = require('prism-react-renderer/themes/nightOwl');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'The Cloud Posse Developer Hub',
  tagline: 'Welcome to the Cloud Posse developer hub. You\'ll find comprehensive guides and documentation to help you start working with the Cloud Posse technology stack as quickly as possible, as well as support if you get stuck. Let\'s jump right in!',
  url: 'https://docs.cloudposse.com',
  baseUrl: '/',
  trailingSlash: true,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  onDuplicateRoutes: 'warn',
  favicon: 'img/favicon.png',
  plugins: [
    // ['@docusaurus/plugin-debug', {'id': 'debug-docs'}],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'docs',
        path: 'content/docs',
        routeBasePath: '/',
        sidebarPath: require.resolve('./sidebars-docs.js'),
        editUrl: ({ versionDocsDirPath, docPath, locale }) => {
          return `https://github.com/cloudposse/docs/edit/master/content/docs/${docPath}`;
        }
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'components',
        path: 'content/components',
        routeBasePath: 'components/',
        sidebarPath: require.resolve('./sidebars-components.js')
      },
    ],
    [
      require.resolve('./src/plugins/changelog/index.js'),
      {
        blogTitle: 'Components Changelog',
        blogDescription: 'Keep yourself up-to-date about new features in every release',
        blogSidebarCount: 'ALL',
        blogSidebarTitle: 'Changelog',
        routeBasePath: '/components/changelog',
        showReadingTime: false,
        postsPerPage: 20,
        archiveBasePath: null,
        authorsMapPath: 'authors.json',
        feedOptions: {
          type: 'all',
          title: 'Cloud Posse components changelog',
          description: 'Keep yourself up-to-date about new features in every release',
          copyright: `Copyright © ${new Date().getFullYear()} Cloud Posse, LLC.`
        },
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'modules',
        path: 'content/modules',
        routeBasePath: 'modules/',
        sidebarPath: require.resolve('./sidebars-modules.js')
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'github_actions',
        path: 'content/github-actions',
        routeBasePath: 'github-actions/',
        sidebarPath: require.resolve('./sidebars-github-actions.js')
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'reference-architecture',
        path: 'content/reference-architecture',
        routeBasePath: 'reference-architecture/',
        sidebarPath: require.resolve('./sidebars-refarch.js')
      },
    ],
    [
      '@docusaurus/plugin-content-pages',
      {
        id: 'account',
        path: 'content/account/',
        routeBasePath: 'account/'
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects
      },
    ],
    [
      '@docusaurus/plugin-google-tag-manager',
      {
        containerId: process.env.GOOGLE_TAG_MANAGER || 'GTM-ABCD123'
      },
    ],
  ],
  organizationName: 'cloudposse',
  projectName: 'docs',
  deploymentBranch: 'production',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  scripts: [
    {
      src: "https://kit.fontawesome.com/3a9f2eb5b9.js",
    },
  ],
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [{ name: 'google-site-verification', content: process.env.GOOGLE_SITE_VERIFICATION_ID || 'preview-local' }],
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true
        },
      },
      navbar: {
        title: '',
        logo: {
          alt: 'Cloud Posse Developer Hub',
          src: 'img/logo.svg',
          srcDark: 'img/logo-light.svg',
        },
        items: [
          {
            to: '/intro',
            position: 'left',
            label: 'Fundamentals',
            activeBaseRegex:
              'fundamentals/.*|' +
              'tutorials/.*|' +
              'howto/.*|' +
              'how-to/.*|' +
              'community/.*|' +
              'glossary/.*|' +
              'reference/.*|' +
              '/intro/',
          },
          {
            type: 'dropdown',
            label: 'Building Blocks',
            position: 'left',
            to: '/fundamentals/building-blocks/',
            items: [
              {
                to: '/components/',
                label: 'Components',
              },
              {
                to: '/modules/',
                label: 'Modules',
              },
              {
                to: '/github-actions/',
                label: 'GitHub Actions',
              },
              {
                href: 'https://atmos.tools',
                label: 'Atmos',
              },
            ]
          },
          {
            href: '/reference-architecture/',
            position: 'left',
            html: 'Reference Architecture',
            target: '_self',
          },
          {
            type: 'dropdown',
            label: 'Community',
            position: 'right',
            items: [
              {
                label: 'GitHub Discussions',
                href: 'https://ask.sweetops.com/',
              },
              {
                label: 'Community',
                href: 'https://sweetops.com/',
              },
              {
                label: 'Slack',
                href: 'https://slack.sweetops.com/',
              },
              {
                label: 'Slack Archives',
                href: 'https://archive.sweetops.com/refarch/',
              },
              {
                label: 'Office Hours',
                href: 'https://cloudposse.com/office-hours/',
              },
            ],
          },
          {
            href: 'https://github.com/cloudposse/',
            className: 'header-github-link',
            position: 'right',
          },
          {
            to: 'https://cloudposse.com/',
            label: 'Accelerate',
            position: 'right',
            className: 'button button--success header-accelerate-button'
          },
          {
            type: 'search',
            position: 'right',
          },
        ],
      },
      algolia: {
        appId: process.env.ALGOLIA_APP_ID || '32YOERUX83',
        apiKey: process.env.ALGOLIA_SEARCH_API_KEY || '557985309adf0e4df9dcf3cb29c61928', // this is SEARCH ONLY API key and is not sensitive information
        indexName: process.env.ALGOLIA_INDEX_NAME || 'docs.cloudposse.com',
        externalUrlRegex: 'atmos\\.tools',
        contextualSearch: false
      },
      footer: {
        style: 'dark',
        links: [{
          title: 'Docs',
          items: [{
            label: 'Getting Started',
            to: '/intro/',
          }, {
            label: 'Building Blocks',
            to: '/fundamentals/building-blocks/',
          }, {
            label: 'Tutorials',
            to: '/category/tutorials/',
          }, {
            label: 'How-To',
            to: '/category/how-to/',
          }],
        }, {
          title: 'Community',
          items: [
            {
              label: 'Github Discussions',
              href: 'https://ask.sweetops.com/',
            },
            {
              label: 'Community',
              href: 'https://sweetops.com/',
            },
            {
              label: 'Slack',
              href: 'https://slack.sweetops.com/',
            },
            {
              label: 'Slack Archives',
              href: 'https://archive.sweetops.com/refarch/',
            },
            {
              label: 'Office Hours',
              href: 'https://cloudposse.com/office-hours/',
            },
          ],
        }, {
          title: 'Contact Us',
          items: [
            {
              label: 'Support',
              href: 'https://cloudposse.com/accelerate',
            },
            {
              label: 'Our GitHub',
              href: 'https://github.com/cloudposse/',
            },
            {
              label: 'Contact Us',
              to: '/contact-us/',
            }],
        }],
        logo: {
          alt: 'Cloud Posse',
          src: '/img/logo-light.svg',
          href: 'https://cloudposse.com/'
        },
        copyright: `© ${new Date().getFullYear()} Cloud Posse, LLC`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['hcl', 'bash', 'rego'],
      },
    }),
};

module.exports = config;
