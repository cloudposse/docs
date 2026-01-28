// @ts-check
const lightCodeTheme = require('prism-react-renderer').themes.vsDark;
const darkCodeTheme = require('prism-react-renderer').themes.nightOwl;
const fs = require('fs');
const path = require('path');

// Redirects handling:
const { getStaticRedirects } = require('./plugins/staticRedirects');
const { redirectsPlugin } = require('./plugins/dynamicRedirects');

// Define the directory containing your CSS files
const cssDirectory = path.resolve(__dirname, './src/css');

// Read all CSS files from the directory
const customCssFiles = fs.readdirSync(cssDirectory)
  .filter(file => file.endsWith('.css'))
  .map(file => require.resolve(path.join(cssDirectory, file)));

//https://github.com/saucelabs/elemental-next/blob/b1a325631243a13a4f3beee58a295b7b36f6574d/frontend/docusaurus.config.js#L105
function metadataPlugin(context, options) {
  return {
    name: 'metadata',
    async allContentLoaded({ actions, allContent }) {
      const { setGlobalData } = actions;
      let docs = []
      allContent['docusaurus-plugin-content-docs']
        .default
        .loadedVersions[0]
        .docs
        .filter(doc => doc.id !== undefined)
        .map((doc) => docs.push(doc));
      //console.log(JSON.stringify(allContent['docusaurus-plugin-content-docs'], 2, 2, null));
      //console.log(tempFrontMatter);
      setGlobalData({ aggregateMetadata: docs });
    }
  }
}

async function createConfig() {
  /** @type {import('@docusaurus/types').Config} */
  const config = {
    title: 'The Cloud Posse Reference Architecture',
    tagline: 'The turnkey architecture for AWS, Datadog & GitHub Actions to get up and running quickly using the Atmos open source framework.',
    url: 'https://docs.cloudposse.com',
    baseUrl: '/',
    trailingSlash: true,
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    onDuplicateRoutes: 'warn',
    favicon: 'img/favicon.png',

    organizationName: 'cloudposse',
    projectName: 'docs',
    deploymentBranch: 'master',
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
      [
        '@docusaurus/plugin-ideal-image',
        {
          quality: 90,
          max: 1030, // max resized image's size.
          min: 640, // min resized image's size. if original is lower, use that size.
          steps: 2, // the max number of images generated between min and max (inclusive)
          disableInDev: false,
        }
      ],
      path.resolve(__dirname, 'plugins/custom-loaders'),
      metadataPlugin,
      [
        "posthog-docusaurus",
        {
          apiKey: "phc_J8pdbvqrRKd5vAoNJ5ObGhBk2AYs6VsF4bo3vU7xOb7",
          appUrl: "https://us.i.posthog.com",
          enableInDevelopment: false, // optional
        },
      ],
      [
        'docusaurus-plugin-sentry',
        {
          DSN: 'b022344b0e7cc96f803033fff3b377ee@o56155.ingest.us.sentry.io/4507472203087872',
        },
      ],
      [
        '@docusaurus/plugin-client-redirects',
        {
          id: 'static-redirects',
          redirects: getStaticRedirects(),
        },
      ],
      [
        'docusaurus-plugin-llms',
        {
          generateLLMsTxt: true,
          generateLLMsFullTxt: true,
          docsDir: 'docs',
          includeBlog: true,
          includeOrder: [
            'into/*',
            'quickstart/*',
            'jumpstart/*',
            'learn/*',
            'layers/*',
            'best-practices/*',
            'reference/*',
            'components/*',
            'modules/*',
            'github-actions/*',
            'resources/*',
            'community/*',
            'support/*',
          ],
        },
      ],
      redirectsPlugin,
      async function AddTailwindCSS(context, options) {
        return {
          name: "docusaurus-tailwindcss",
          configurePostCss(postcssOptions) {
            // Appends TailwindCSS and AutoPrefixer.
            postcssOptions.plugins.push(require("@tailwindcss/postcss"));
            postcssOptions.plugins.push(require("autoprefixer"));
            return postcssOptions;
          },
        };
      },
    ],

    presets: [
      [
        'classic',
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            routeBasePath: '/',
            sidebarPath: require.resolve('./sidebars.js'),
            editUrl: ({ versionDocsDirPath, docPath, locale }) => {
              return `https://github.com/cloudposse/docs/edit/master/${versionDocsDirPath}/${docPath}`;
            },
            exclude: ['README.md'],
            showLastUpdateTime: true,
            showLastUpdateAuthor: true,
            // Ignore tags missing from tags.yml
            // There are many from components and GHA, it's too much noise without being helpful
            onInlineTags: 'ignore',
            tags: 'tags.yml',
            include: ['**/*.md', '**/*.mdx'],
            // Versioning configuration - see internal/docs-versioning.md for how to create new versions
            includeCurrentVersion: true,
            // Custom paths for versioned docs
            path: 'docs',
            versions: {
              current: {
                label: 'Latest',
                path: '',
              },
              v1: {
                label: 'v1',
                path: 'v1',
              },
            },
          },
          blog: {
            showReadingTime: false,
            postsPerPage: 10,
            blogTitle: 'Cloud Posse Announcements',
            blogDescription: 'Stay up to date with the latest news and updates from Cloud Posse',
            include: ['**/*.{md,mdx}'],
            editUrl: ({ blogDirPath, blogPath, permalink, locale }) => {
              return `https://github.com/cloudposse/docs/edit/master/${blogPath}`;
            },
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
              type: 'doc',
              docId: 'learn/concepts',
              position: 'left',
              label: 'Learn',
            },
            {
              type: 'doc',
              docId: 'reference/reference',
              position: 'left',
              label: 'Reference',
            },
            {
              type: 'doc',
              docId: 'community/community',
              label: 'Community',
              position: 'left',
            },
            {
              to: '/blog',
              label: 'Blog',
              position: 'left',
            },
            {
              type: 'docsVersionDropdown',
              position: 'right',
              dropdownActiveClassDisabled: true,
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
              type: 'doc',
              docId: 'support/index',
              label: 'Get Support',
              position: 'right',
              className: 'button button--primary navbar-cta-button'
            },
          ],
        },

        announcementBar: {
          id: 'quickstart',
          content:
            'Missing the <strong>Quickstart</strong> configurations? <a href="/intro/path/">Start here!</a>',
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
                label: 'Reference Architecture',
                to: '/reference/',
              }
            ],
          }, {
            title: 'Community',
            items: [
              {
                label: 'GitHub Discussions',
                href: 'https://github.com/orgs/cloudposse/discussions',
              },
              {
                label: 'Slack Community',
                to: '/community/slack/',
              },
              {
                label: 'Slack Archives',
                href: 'https://archive.sweetops.com/refarch/',
              },
              {
                label: 'Office Hours',
                to: '/community/office-hours/',
              },
            ],
          }, {
            title: 'Contact Us',
            items: [
              {
                label: 'Support',
                to: '/support/',
              },
              {
                label: 'Our GitHub',
                href: 'https://github.com/cloudposse/',
              },
              {
                label: 'Contact Us',
                to: '/community/contact-us/',
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
          options: {
            flowchart: {
              useMaxWidth: true,
              curve: 'linear',
              padding: 15,
              diagramPadding: 20,
              nodeSpacing: 40,
              rankSpacing: 50,
              ranksep: 100,
              nodesep: 100,
              titleTopMargin: 25,
              titlePadding: 30,
              labelPadding: 30,
              subGraphTitleMargin: {
                top: 5,
                bottom: 5
              }
            },

            themeVariables: {
              mainBkg: '#6f72723b',
              background: '#333',
              clusterBkg: '#6f72723b'
            }
          }
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
  return config;
}

module.exports = createConfig();
