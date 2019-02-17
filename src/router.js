import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/account',
      name: 'Account',
      component: () => import(/* webpackChunkName: "account" */ '@/views/Account'),
      children: [
        {
          path: '',
          name: 'AccountManage',
          component: () => import(/* webpackChunkName: "account-manage" */ '@/views/Account/Manage'),
        },
      ],
    },
    {
      path: '/promotion',
      name: 'Promotion',
      component: () => import(/* webpackChunkName: "promotion" */ '@/views/Promotion'),
      children: [
        {
          path: '',
          name: 'PromotionList',
          component: () => import(/* webpackChunkName: "promotion-list" */ '@/views/Promotion/List'),
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/Login'),
    },
  ],
});
