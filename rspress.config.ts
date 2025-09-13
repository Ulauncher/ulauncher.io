import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: 'docs',
  title: 'Ulauncher',
  description: 'Application launcher for Linux 🐧',
  icon: '/favicon.ico',
  logo: '/images/ulauncher-logo.png',
  themeConfig: {
    nav: [
      { text: 'Extensions', link: 'https://ext.ulauncher.io' },
      { text: 'API Docs', link: '/api' },
      { text: 'Bugs & Discussions', link: 'https://github.com/Ulauncher/Ulauncher/issues' },
      { text: 'Color Themes', link: 'https://gist.github.com/gornostal/02a232e6e560da7946c053555ced6cce' },
    ],
  },
});
