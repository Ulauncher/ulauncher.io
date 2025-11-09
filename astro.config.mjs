import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
	integrations: [
		mermaid(),
		starlight({
			title: 'Ulauncher',
			favicon: '/favicon.ico',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/Ulauncher/Ulauncher' },
			],
			sidebar: [
				{
					label: 'Extension Development',
					autogenerate: { directory: 'extensions' },
				},
				{
					label: 'Color Themes',
					autogenerate: { directory: 'themes' },
				}
			],
		}),
	],
});
