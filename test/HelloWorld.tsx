import { defineComponent, ref } from 'vue'
import a from './h.module.scss'

export default defineComponent({
	setup(prop, { slots }) {
		const count = ref(0)
		if (count.value === 0) {
			console.log(1)
		}
		{
		}
		const inc = () => {
			count.value++
		}

		return () => (
			<>
				{slots.default!()}
				<div id={a.aad} onClick={inc}>
					{count.value}
				</div>
				{slots.add!()}
			</>
		)
	}
})
