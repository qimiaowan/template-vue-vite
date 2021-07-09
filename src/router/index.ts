import { createRouter, createWebHistory, RouteRecordRaw, RouteComponent } from 'vue-router'

const routes: Array<RouteRecordRaw> = []

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			return { top: 0 }
		}
	}
})

export default router
