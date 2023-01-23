// @ts-check

const lightCodeTheme = require('prism-react-renderer/themes/vsDark');
const darkCodeTheme = require('prism-react-renderer/themes/nightOwl');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'The Cloud Posse Developer Hub',
  tagline: 'Welcome to the Cloud Posse developer hub. You\'ll find comprehensive guides and documentation to help you start working with the Cloud Posse technology stack as quickly as possible, as well as support if you get stuck. Let\'s jump right in!',
  url: 'https://docs2.cloudposse.com',
  baseUrl: '/',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  onDuplicateRoutes: 'throw',
  favicon: 'img/favicon.png',
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'content',
        path: 'content',
        routeBasePath: '/',
        sidebarPath: require.resolve('./sidebars.js'),
        editUrl: ({versionDocsDirPath, docPath, locale}) => {
          return `https://github.com/cloudposse/cloudposse-docs/edit/cloudposse-docs/docs/${docPath}`;
        }
      },
    ],
    [
      "@docusaurus/plugin-google-gtag",
      {
        id: "google-tag-manager",
        trackingID: process.env.GOOGLE_TAG_MANAGER || 'GTM-ABCD123', // prod: "GTM-WQWH2XV",
        anonymizeIP: true,
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
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
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
          srcDark: 'img/logo-light.png',
        },
        items: [
          {
            type: 'dropdown',
            label: 'Community',
            position: 'right',
            items: [
              {
                label: 'Forum',
                href: 'https://ask.sweetops.com/',
              },
              {
                label: 'Community',
                href: 'https://sweetops.com/',
              },
              {
                label: 'Slack',
                href: 'https://slack.sweetops.com/',
              }
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
        indexName: 'docs2dev',
        contextualSearch: false
      },
      footer: {
        style: 'light',
        links: [],
        copyright: `© ${new Date().getFullYear()} Cloud Posse, LLC`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['hcl', 'bash'],
      },
    }),
};

module.exports = config;
