import { defineComponent } from 'vue'
import a from './app.module.css'
import HelloWorld from './HelloWorld'

export default defineComponent({
	name: 'App',
	components: {
		HelloWorld
	},
	setup() {
		const arr = [11, 32, 33, 11, 24, 33, 65, 76, 132, 2, 4, 2, 4, 3, 15, 66]
		const sort = ([x, ...data]: number[] = arr): number[] => {
			return x
				? sort(data.filter((item: number) => item < x))
						.concat(arr.filter((item: number) => item === x))
						.concat(sort(data.filter((item: number) => item > x)))
				: []
		}
		const data = sort(arr)
		console.log(data)
		const c: [string, string?] = ['hell1o1']

		console.log(c)

		new Promise((resolve, reject) => {
			resolve(1)
		}).then(res => {
			console.log(res)
		})
		function getImageUrl(name: string) {
			return new URL(`./${name}.png`, import.meta.url).href
		}
		const url = getImageUrl('logo')
		const aa = <div>B3124314313</div>
		const add = {
			add: () => <div>1</div>
		}
		return () => (
			<>
				<img class='w-32 h-32  rounded-full mx-au' src={url} alt='' />
				<div id={a.app}>123{aa}</div>
				<HelloWorld v-slots={add}>{aa}</HelloWorld>
			</>
		)
	}
})
