const homePage = resolve => require(['./pages/index.vue'], resolve);
export default [
        {
            path: '/',
            component: homePage
        }
    ]