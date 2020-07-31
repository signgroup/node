import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'



import {get, post} from "./assets/js/http"
import md5 from 'js-md5'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.prototype.$md5=md5
Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.use(ElementUI);
new Vue({
    store,
    router,
  render: h => h(App)
}).$mount('#app')
