import { defineConfig } from 'rspress/config';
import path from 'path';

export default defineConfig({
  root: 'docs',
  title: 'Ulauncher',
  description: 'Application launcher for Linux 🐧',
  icon: '/favicon.ico',
  logo: '/images/ulauncher-logo.png',
  globalStyles: path.join(__dirname, 'styles/global.css'),
  themeConfig: {
    footer: {
      message: '© 2015-2025 Ulauncher Team <a href="https://github.com/Ulauncher/ulauncher.io">&lt;/&gt;</a>',
    },
    nav: [
      { text: 'Download', link: '/download' },
      { text: 'Extensions', link: 'https://ext.ulauncher.io' },
      {
        text: 'Docs',
        items: [
          { text: 'Video tutorials', link: '/video-tutorials' },
          { text: 'Creating extensions', link: '/extensions' },
          { text: 'Creating a color theme', link: '/color-themes' },
        ]
      },
      { text: 'Bugs & Discussions', link: 'https://github.com/Ulauncher/Ulauncher/issues' },
      { text: 'Color Themes', link: 'https://gist.github.com/gornostal/02a232e6e560da7946c053555ced6cce' },
    ],
  },
});
