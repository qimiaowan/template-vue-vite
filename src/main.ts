import { createApp } from 'vue'
import App from '@/App'
import router from '@/router'
import { store } from '@/store'
import cacheStorage from './utils/cacheStorage'
import cacheSession from './utils/cacheSession'

import 'tailwindcss/tailwind.css'
import '@/utils/rem'

const app = createApp(App)

app.use(router).use(store).mount('#app')

app.config.globalProperties.$cacheStorage = cacheStorage
app.config.globalProperties.$cacheSession = cacheSession
