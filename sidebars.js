/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

module.exports = {
    learn: [
        {
          type: 'category',
          label: 'Getting Started',
          className: 'sidebar-title',
          collapsible: false,
          collapsed: false,
          items: [
            {
              type: 'category',
              label: 'Architecture Overview',
              collapsible: true,
              collapsed: false,
              link: {
                type: 'doc',
                id: 'intro/index'
              },
              items: [
                {
                    type: 'autogenerated',
                    dirName: 'intro',
                }
              ]
            },
            {
              type: 'category',
              label: 'Support',
              collapsible: true,
              collapsed: true,
              link: {
                type: 'doc',
                id: 'support/support'
              },
              items: [
                {
                    type: 'autogenerated',
                    dirName: 'support',
                }
              ]
            },
            {
              type: 'category',
              label: 'Quickstart (DIY)',
              collapsible: true,
              collapsed: true,
              link: {
                type: 'doc',
                id: 'quickstart/quickstart'
              },
              items: [
                {
                    type: 'autogenerated',
                    dirName: 'quickstart',
                }
              ]
            },

            {
              type: 'category',
              label: 'Jumpstart Customers',
              collapsible: true,
              collapsed: true,
              link: {
                type: 'doc',
                id: 'jumpstart/jumpstart'
              },
              items: [
                {
                    type: 'autogenerated',
                    dirName: 'jumpstart',
                }
              ]
            },


          ]
        },
        {
          type: 'category',
          label: 'Learn refarch',
          className: 'sidebar-title',
          collapsible: false,
          collapsed: false,
          items: [
            {
              type: 'autogenerated',
              dirName: 'learn',
            },
            {
              type: 'category',
              label: 'Component Development',
              collapsible: true,
              collapsed: true,
              link: {
                type: 'doc',
                id: 'learn/component-development/component-development'
              },
              items: [
                {
                    type: 'autogenerated',
                    dirName: 'learn/component-development',
                }
              ]
            }
          ]
        },

        {
          type: 'category',
          label: 'Build Your Foundation',
          className: 'sidebar-title',
          collapsible: false,
          collapsed: false,
          items: [
            {
              type: 'category',
              label: 'Setup your project',
              collapsible: true,
              collapsed: true,
              link: {
                type: 'doc',
                id: 'layers/foundation/foundation'
              },
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'layers/foundation',
                }
              ]
            },
            {
              type: 'category',
              label: 'Manage Accounts',
              collapsible: true,
              collapsed: true,
              link: {
                type: 'doc',
                id: 'layers/accounts/accounts'
              },
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'layers/accounts',
                }
              ]
            },
            {
              type: 'category',
              label: 'Identity and Authentication',
              collapsible: true,
              collapsed: true,
              link: {
                type: 'doc',
                id: 'layers/identity/identity'
              },
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'layers/identity',
                }
              ]
            },
            {
              type: 'category',
              label: 'Network and DNS',
              collapsible: true,
              collapsed: true,
              link: {
                type: 'doc',
                id: 'layers/network-and-dns/network-and-dns'
              },
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'layers/network-and-dns',
                }
              ]
            }
          ]
        },
        {
          type: 'category',
          label: 'Set Up Your Platform',
          className: 'sidebar-title',
          collapsible: false,
          collapsed: false,
          items: [
            {
              type: 'category',
              label: 'Container Orchestration',
              collapsible: true,
              collapsed: true,
              items: [
                {
                  type: 'category',
                  label: 'Using ECS',
                  collapsible: true,
                  collapsed: true,
                  link: {
                    type: 'doc',
                    id: 'layers/ecs/ecs'
                  },
                  items: [
                    {
                      type: 'autogenerated',
                      dirName: 'layers/ecs',
                    }
                  ]
                },
                {
                  type: 'category',
                  label: 'Using EKS',
                  collapsible: true,
                  collapsed: true,
                  link: {
                    type: 'doc',
                    id: 'layers/eks/eks'
                  },
                  items: [
                    {
                      type: 'autogenerated',
                      dirName: 'layers/eks',
                    }
                  ]
                },
              ]
            },
            {
              type: 'category',
              label: 'Configure GitHub Actions',
              collapsible: true,
              collapsed: true,
              link: {
                type: 'doc',
                id: 'layers/github-actions/github-actions'
              },
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'layers/github-actions',
                }
              ]
            },
            {
              type: 'category',
              label: 'Automate Terraform',
              collapsible: true,
              collapsed: true,
              items: [
                {
                  type: 'category',
                  label: 'GitHub Actions',
                  collapsible: true,
                  collapsed: true,
                  link: {
                    type: 'doc',
                    id: 'layers/gitops/gitops'
                  },
                  items: [
                    {
                      type: 'autogenerated',
                      dirName: 'layers/gitops',
                    }
                  ]
                },
                {
                  type: 'category',
                  label: 'Spacelift',
                  collapsible: true,
                  collapsed: true,
                  link: {
                    type: 'doc',
                    id: 'layers/spacelift/spacelift'
                  },
                  items: [
                    {
                      type: 'autogenerated',
                      dirName: 'layers/spacelift',
                    }
                  ]
                },
              ]
            },
          ]
        },
        {
          type: 'category',
          label: 'Deploy Your Apps',
          className: 'sidebar-title',
          collapsible: false,
          collapsed: false,
          items: [
            {
              type: 'category',
              label: 'Provision Databases',
              collapsible: true,
              collapsed: true,
              link: {
                type: 'doc',
                id: 'layers/data/data'
              },
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'layers/data',
                }
              ]
            },
            {
              type: 'category',
              label: 'Implement CI/CD',
              collapsible: true,
              collapsed: true,
              link: {
                type: 'doc',
                id: 'layers/application-cicd/application-cicd'
              },
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'layers/application-cicd',
                }
              ]
            }
          ],
        },

        {
          type: 'category',
          label: 'Monitor Everything',
          className: 'sidebar-title',
          collapsible: false,
          collapsed: false,
          items: [
            {
              type: 'category',
              label: 'Implement Telemetry',
              collapsible: true,
              collapsed: true,
              link: {
                type: 'doc',
                id: 'layers/monitoring/monitoring'
              },
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'layers/monitoring',
                }
              ]
            },
            {
              type: 'category',
              label: 'Manage Incidents',
              collapsible: true,
              collapsed: true,
              link: {
                type: 'doc',
                id: 'layers/alerting/alerting'
              },
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'layers/alerting',
                }
              ]
            },
            {
              type: 'category',
              label: 'Security and Compliance',
              collapsible: true,
              collapsed: true,
              link: {
                type: 'doc',
                id: 'layers/security-and-compliance/security-and-compliance'
              },
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'layers/security-and-compliance',
                }
              ]
            }
          ]
        },
        {
          type: 'category',
          label: 'Upgrade and Maintain',
          className: 'sidebar-title',
          collapsible: false,
          collapsed: false,
          link: {
            type: 'doc',
            id: 'learn/maintenance/maintenance'
          },
          items: [
            {
              type: 'autogenerated',
              dirName: 'learn/maintenance',
            }
          ]
        },
        {
          type: 'category',
          label: 'Best Practices',
          className: 'sidebar-title',
          collapsible: true,
          collapsed: false,
          items: [
            {
                type: 'autogenerated',
                dirName: 'best-practices',
            }
          ]
        },
    ],
    reference: [
        {
          type: 'category',
          label: 'Reference',
          className: 'sidebar-title',
          collapsible: false,
          collapsed: false,
          items: [
            {
                type: 'autogenerated',
                dirName: 'reference',
            }
          ]
        },
        {
            type: 'category',
            label: 'Terraform Components',
            className: 'sidebar-title',
            collapsible: true,
            collapsed: false,
            link: {
              type: 'doc',
              id: 'components/index'
            },
            items: [
                {
                    type: 'autogenerated',
                    dirName: 'components/library',
                }
            ]
        },
        {
            type: 'category',
            label: 'Terraform Modules',
            className: 'sidebar-title',
            collapsible: true,
            collapsed: false,
            link: {
              type: 'doc',
              id: 'modules/index'
            },
            items: [
                {
                    type: 'autogenerated',
                    dirName: 'modules/library',
                }
            ]
        },
        {
            type: 'category',
            label: 'GitHub Actions',
            className: 'sidebar-title',
            collapsible: true,
            collapsed: true,
            link: {
              type: 'doc',
              id: 'github-actions/index'
            },
            items: [
                {
                    type: 'autogenerated',
                    dirName: 'github-actions/library/actions',
                }
            ]
        },
        {
          type: 'category',
          label: 'Resources',
          className: 'sidebar-title',
          collapsible: true,
          collapsed: false,
          items: [
            {
                type: 'autogenerated',
                dirName: 'resources',
            }
          ]
        },
    ],
    community: [
      {
          type: 'category',
          label: 'Community',
          className: 'sidebar-title',
          collapsible: false,
          collapsed: false,
          link: {type: 'doc', id: 'community/community'},
          items: [ 'community/slack',
                   'community/office-hours',
                   'community/contact-us',
                   'community/support'
                 ]
      },
      {
        type: 'category',
        label: 'Contribute',
        className: 'sidebar-title',
        collapsible: false,
        collapsed: false,
        items: [
          {
              type: 'autogenerated',
              dirName: 'community/contribute',
          }
        ]
      }
  ],
};
