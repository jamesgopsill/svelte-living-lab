export default {
	mount: {
		public: {url: "/", static: true},
		src: {url: "/dist"},
	},
	plugins: [
		"./snowpack-plugins/svelte-check.js",
		"@snowpack/plugin-typescript",
		"@snowpack/plugin-svelte",
	],
	routes: [],
	optimize: {
		"bundle": true,
	},
	packageOptions: {
	},
	devOptions: {},
	buildOptions: {
		"out": "docs"
	},
}