import Vue from 'vue';
import VueRouter from 'vue-router';
import routers from './routers';
import App from './App.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    routers
});

// 创建基础组件
const div = document.createElement('div');
div.id = 'app';
document.body.appendChild(div);

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');