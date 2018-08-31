import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import routers from './routers';
Vue.use(VueRouter);
const router = new VueRouter({
    routers
});
let div = document.createElement('div');
div.id = 'app';
document.body.appendChild(div);
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');