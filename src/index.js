import Vue from 'vue';
import App from './App.vue';
import routers from './routers';
import Router from 'vue-router';
Vue.use(Router);
const router = new Router({
    routes: routers    
});
let div = document.createElement('div');
div.id = 'app';
document.body.appendChild(div);

function  init() {
    new Vue({
        router,
        render: h => h(App)
    }).$mount('#app');
}

init();
