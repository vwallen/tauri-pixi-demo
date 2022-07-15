import { createRouter, createMemoryHistory } from 'vue-router'
import { createApp } from 'vue'

import '@/style.css'
import App from '@/App.vue'
import Start from '@/components/Start.vue'
import Game from '@/components/Game.vue'

const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        {'path': '/start', 'component': Start},
        {'path': '/game',  'component': Game},
    ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')

router.push('/start')
