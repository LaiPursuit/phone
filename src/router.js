import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import home from './pages/home/home';
import advisory from './pages/advisory/advisory';
import collection from './pages/collection/collection';
import phone from './pages/phone/phone';

export default new VueRouter({
    routes: [
        {
            path: '/',
            component: home
        },
        {
            path: '/advisory',
            component: advisory
        },
        {
            path: '/collection',
            component: collection
        },
        {
            path: '/phone',
            component: phone
        },
        {
            path: '*',
            component: home
        }
    ]
});
