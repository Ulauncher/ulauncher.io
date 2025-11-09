import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
	integrations: [
		mermaid(),
		starlight({
			title: 'Ulauncher',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/Ulauncher/Ulauncher' },
			],
			sidebar: [
				{
					label: 'Color Themes',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Overview', slug: 'themes/themes' },
						{ label: 'Creating custom themes', slug: 'themes/custom' },
						{ label: 'Migrating themes', slug: 'themes/migrate' },
					],
				},
				{
					label: 'Extension Development',
					items: [
						{ label: 'Overview', slug: 'extensions/overview' },
						{ label: 'Development Tutorial', slug: 'extensions/tutorial' },
						{ label: 'Testing & Logging', slug: 'extensions/debugging' },
						{ label: 'Examples', slug: 'extensions/examples' },
						{ label: 'Migrating extensions', slug: 'extensions/migration' },
					],
				}
			],
		}),
	],
});
