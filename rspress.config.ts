import { defineConfig } from "rspress/config";
import path from "path";

export default defineConfig({
  root: "docs",
  title: "Ulauncher",
  description: "Application launcher for Linux 🐧",
  icon: "/favicon.ico",
  logo: "/images/ulauncher-logo.png",
  globalStyles: path.join(__dirname, "styles/global.css"),
  builderConfig: {
    html: {
      tags: [
        {
          tag: "script",
          attrs: { defer: true, src: "/analytics.js" },
        },
      ],
    },
  },
  themeConfig: {
    footer: {
      message:
        '© 2015-2025 Ulauncher Team <a href="https://github.com/Ulauncher/ulauncher.io">&lt;/&gt;</a>',
    },
  },
  search: {
    searchHooks: path.join(__dirname, "./search.tsx"),
  },
});
