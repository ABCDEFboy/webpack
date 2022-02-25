/**
 * Ava UI 组件按需引入
 * @example
 * import { Button } from 'ava-ui';
 * [Button].forEach((component: any) => Vue.use(component));
 */
import Vue from 'vue';
import {} from 'ava-ui';

// eslint-disable-next-line
[].forEach((component: any) => Vue.use(component));

/**
 * 其它类型
 */
// Vue.use(Loading.directive);

// Vue.prototype.$confirm = MessageBox.confirm;
// Vue.prototype.$alert = MessageBox.alert;
// Vue.prototype.$loading = Loading.service;
// Vue.prototype.$message = Message;
