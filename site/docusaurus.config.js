// @ts-check
const { themes: prismThemes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Are-Self Learn',
  tagline: 'Why do for yourself what Are-Self can do for you?',
  favicon: 'img/favicon.ico',

  url: 'https://are-self.com',
  baseUrl: '/learn/',

  organizationName: 'scipraxian',
  projectName: 'are-self-learn',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    format: 'detect',
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/scipraxian/are-self-learn/tree/main/site/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/are-self-social-card.png',
      navbar: {
        title: 'Are-Self Learn',
        logo: {
          alt: 'Are-Self Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'learnSidebar',
            position: 'left',
            label: 'Courses',
          },
          {
            href: '/learn/glossary',
            label: 'Glossary',
            position: 'left',
          },
          {
            href: '/learn/tags-reference',
            label: 'Tags',
            position: 'left',
          },
          {
            href: 'https://are-self.com',
            label: 'Are-Self Home',
            position: 'right',
          },
          {
            href: 'https://are-self.com/docs/quick-start',
            label: 'For Developers',
            position: 'right',
          },
          {
            href: 'https://github.com/scipraxian/are-self-learn',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Learn',
            items: [
              { label: 'All Courses', to: '/' },
              { label: 'Glossary', to: '/glossary' },
              { label: 'Tags', to: '/tags-reference' },
            ],
          },
          {
            title: 'Are-Self',
            items: [
              { label: 'Home', href: 'https://are-self.com' },
              { label: 'Developer Docs', href: 'https://are-self.com/docs/intro' },
              { label: 'Storybook', href: 'https://are-self.com/docs/storybook' },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/scipraxian/are-self-learn',
              },
              {
                label: 'Scipraxian',
                href: 'https://scipraxian.org',
              },
              {
                label: 'Haunted Space Hotel',
                href: 'https://hauntedspacehotel.com',
              },
            ],
          },
        ],
        copyright: `MIT Licensed. Built by Michael Clark. ${new Date().getFullYear()}.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['python', 'bash', 'json'],
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
    }),
};

module.exports = config;
