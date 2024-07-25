// @ts-check
const lightCodeTheme = require('prism-react-renderer').themes.vsDark;
const darkCodeTheme = require('prism-react-renderer').themes.nightOwl;
const fs = require('fs');
const path = require('path');

// Define the directory containing your CSS files
const cssDirectory = path.resolve(__dirname, './src/css');

// Read all CSS files from the directory
const customCssFiles = fs.readdirSync(cssDirectory)
  .filter(file => file.endsWith('.css'))
  .map(file => require.resolve(path.join(cssDirectory, file)));


/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'The Cloud Posse Reference Architecture',
  tagline: 'The turnkey architecture for AWS, Datadog & GitHub Actions to get up and running quickly using the Atmos open source framework.',
  url: 'https://docs.cloudposse.com',
  baseUrl: '/',
  trailingSlash: true,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  onDuplicateRoutes: 'warn',
  favicon: 'img/favicon.png',

  organizationName: 'cloudposse',
  projectName: 'docs',
  deploymentBranch: 'staging',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      '@docusaurus/plugin-google-tag-manager',
      {
        containerId: process.env.GOOGLE_TAG_MANAGER || 'GTM-ABCD123'
      },
    ],
    [
      'docusaurus-plugin-image-zoom', {},
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
          docs: {
              routeBasePath: '/',
              sidebarPath: require.resolve('./sidebars.js'),
              editUrl: ({versionDocsDirPath, docPath, locale}) => {
                return `https://github.com/cloudposse/docs/edit/master/content/docs/${docPath}`;
              },
              exclude: ['README.md'],
              showLastUpdateTime: true,
              showLastUpdateAuthor: true
          },
          theme: {
              customCss: customCssFiles,
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
            to: '/learn',
            position: 'left',
            label: 'Learn',
          },
          {
            to: '/reference',
            position: 'left',
            label: 'Reference',
          },
          {
            to: '/community',
            label: 'Community',
            position: 'left',
          },
          {
            type: 'search',
            position: 'right',
          },
          {
            href: 'https://github.com/cloudposse/',
            className: 'header-github-link',
            position: 'right',
          },
          {
            to: 'https://cloudposse.com/',
            label: 'Get a Jumpstart',
            position: 'right',
            className: 'button button--primary navbar-cta-button'
          },
        ],
      },

      announcementBar: {
        id: 'new_docs',
        content:
          'We are in the process of updating our documentation. <a href="mailto:docs@cloudposse.com">Please let us know what you think!</a>',
        backgroundColor: 'var(--announcement-bar-background)',
        textColor: 'var(--announcement-bar-text-color)',
        isCloseable: true,
      },

      colorMode: {
        // "light" | "dark"
        defaultMode: 'dark',

        // Hides the switch in the navbar
        // Useful if you want to force a specific mode
        disableSwitch: false,

        // Should respect the user's color scheme preference
        // "light" | "dark" | "system"
        respectPrefersColorScheme: false,
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
          items: [
            {
              label: 'Learn',
              to: '/learn/',
            },
            {
              label: 'Reference',
              to: '/reference/',
            }
          ],
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
      mermaid: {
        theme: {
            light: 'neutral',
            dark: 'dark',
        },
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['hcl', 'bash', 'rego'],
      },
      zoom: {
        selector: '.markdown > img',
        config: {
          // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
          background: {
            light: 'rgb(255, 255, 255)',
            dark: 'rgb(50, 50, 50)'
          }
        }
      }
    }),
};

module.exports = config;
