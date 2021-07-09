import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import viteTransformPlugin from './build/vite-plugin-transform'

export default ({ mode }) =>
	defineConfig({
		resolve: {
			alias: {
				'@': resolve(__dirname, 'src')
			}
		},
		optimizeDeps: {
			exclude: ['__INDEX__']
		},
		base: loadEnv(mode, process.cwd(), 'zdh').zdh_base,
		plugins: [viteTransformPlugin(), vue(), vueJsx({})],
		server: {
			port: 8080,
			host: '0.0.0.0'
		},
		build: {
			rollupOptions: {
				plugins: [
					getBabelOutputPlugin({
						presets: ['@babel/preset-env']
					})
				]
			}
		},
		esbuild: {
			jsxFactory: 'h',
			jsxFragment: 'Fragment'
		}
	})
