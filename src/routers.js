// 路由配置
const HomePage = resolve => require(['./pages/index.vue'], resolve);
export default [
    {
        name: 'index',
        path: '/index',
        components: HomePage
    }
]