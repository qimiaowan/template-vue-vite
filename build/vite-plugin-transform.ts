import { Plugin } from 'vite'
const viteTransformPlugin = () => {
	let env: string
	const transformIndexHtml = code => {
		switch (env) {
			case 'test':
				return code.replace(/__INDEX__/, '/test/main.ts')
			default:
				return code.replace(/__INDEX__/, '/src/main.ts')
		}
	}
	const demoIndexTransFormPlugin: Plugin = {
		name: 'demo-transform',
		enforce: 'pre',
		config(_, { mode }) {
			env = mode
		},
		transform(code, id) {
			if (id.endsWith('.html')) {
				return { code: transformIndexHtml(code), map: null }
			}
		},
		transformIndexHtml
	}

	return demoIndexTransFormPlugin
}

export default viteTransformPlugin
