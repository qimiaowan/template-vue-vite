import { defineComponent } from 'vue'
import app from './app.module.scss'
export default defineComponent({
	name: 'App',
	setup() {
		return () => (
			<>
				<div class={app.btn}>welcome!</div>
			</>
		)
	}
})
