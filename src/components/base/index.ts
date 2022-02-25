import Vue from 'vue';

/**
 * 注册时加上 App 前缀
 *
 * @example
 * import AppBaseComponent from './BaseComponentA.vue';
 */

// eslint-disable-next-line
const components: { [propName: string]: any } = {
  // AppBaseComponent
};

/**
 * 注册全局组件
 */
Object.keys(components).forEach(k => Vue.component(k, components[k]));
