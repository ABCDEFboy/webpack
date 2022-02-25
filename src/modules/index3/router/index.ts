import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

const Index = () =>
  import(/* webpackChunkName: "login" */ '../views/Index.vue');

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Index
  }
];

const router = new VueRouter({
  routes
});

export default router;
