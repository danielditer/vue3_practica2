import {createRouter, createWebHistory} from 'vue-router'
import ProductoView from "@/views/producto/ProductoView.vue";
import CategoryView from "@/views/categoria/CategoryView.vue";

const routes = [
    {
        path: '/producto',
        name: 'producto',
        component: ProductoView
    },
    {
        path: '/categoria',
        name: 'categoria',
        component: CategoryView
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
