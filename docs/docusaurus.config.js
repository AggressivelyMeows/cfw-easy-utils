module.exports = {
  title: 'CF Workers: Easy utils',
  tagline: 'The best helper package for CF Workers!',
  url: 'https://utils.docs.ceru.dev',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Sponsus', // Usually your GitHub org/user name.
  projectName: 'cfw-easy-utils', // Usually your repo name.
  themeConfig: {
    defaultMode: 'dark', 
    disableSwitch: true,

    navbar: {
      title: 'CF-Workers: Easy Utils',
      logo: {
        alt: 'My Site Logo',
        src: 'https://media.spns.us/ext/easy-utils.png',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/aggressivelymeows/cfw-easy-utils',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Connor Vince.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/aggressivelymeows/cfw-easy-utils/docs/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/aggressivelymeows/cfw-easy-utils/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
