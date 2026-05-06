// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import './components/styles/index.scss'
import App from './App.vue'
import { preloadAllPromptItems } from './data/loader'

// 预加载所有提示词数据
preloadAllPromptItems().then(() => {
  console.log('所有提示词数据预加载完成')
})

const app = createApp(App)
app.use(createPinia())
app.mount('#app')