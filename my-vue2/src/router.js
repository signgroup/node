import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
const Home =() => import(/* webpackChunkName: "home" */ './views/Home.vue')
const Login = () =>import(/* webpackChunkName: "login" */ './views/Login.vue')
const About =() => import(/* webpackChunkName: "about" */ './views/About.vue')


Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            meta: {
                requireAuth: true
            },
            component: Home
        },
        {
            path: '/home',
            name: 'home',
            meta: {
                requireAuth: true
            },
            component:  Home
        },
        {
            path: '/login',
            name: 'login',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component:  Login
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: About
        }
    ]
})
router.beforeEach((to, from, next) => {
    // console.log('to', to.matched)
    // console.log('from', from)
    // console.log('next', next)
    // 判断是否需要登录权限
    // let status = localStorage.getItem("accessToken") ? false : true
    let status = !store.state.token
    /*
     *   meta: {requireAuth: true},
     *   some:一真为真 every:一假为假
     *   需要拦截 并且 没有登录信息
     *   进入login页面
    */
    if (to.matched.some(res => res.meta.requireAuth) && status) {
        next('/login')
    } else {
        next()
    }
})
export default router;
