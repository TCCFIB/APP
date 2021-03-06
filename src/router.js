import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
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
      path: '/coupon',
      name: 'Coupon',
      component: () => import(/* webpackChunkName: "coupon" */ '@/views/Coupon'),
      children: [
        {
          path: '',
          name: 'CouponList',
          component: () => import(/* webpackChunkName: "coupon-list" */ '@/views/Coupon/List'),
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
