// 按需引入组件
// import { Button } from 'element-ui';

// import './directives/index';
import Vue from 'vue';
import store from './store';
import App from './App.vue';
import router from './router';

import './assets/styles/index.scss';

Vue.config.productionTip = false;

async function render() {
  return new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
}

render();
