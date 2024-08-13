import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';

import './assets/styles/styles.scss'

// Importaciones axios
import axios from 'axios'
import VueAxios from 'vue-axios'
import toasts from "@/toasts";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(VueAxios, axios);
app.use(toasts);

app.mount('#app')
