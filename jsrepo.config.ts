import { defineConfig } from 'jsrepo';
import stripTypes from '@jsrepo/transform-javascript';

export default defineConfig({
    // configure where stuff comes from here
    registries: [],
    // configure where stuff goes here
    paths: {
		component: './src/components/ui',
		file: './src/components/ui'
	},
	transforms: [stripTypes()]
});
