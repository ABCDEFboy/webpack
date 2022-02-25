# 基础组件

基础组件要求不与业务耦合，满足**高内聚低耦合的规范**

统一由 `index.ts` 引入并导出，最后在 `main.ts` 中统一注册

## 目录结构

```
├─index.ts
├─BaseComponentA.ts
└─BaseComponentB.ts
```

## index.ts

```typescript
import Vue from 'vue';

/**
 * 注册时加上 App 前缀
 */
import AppBaseComponent from './BaseComponentA.vue';

// eslint-disable-next-line
const components: { [propName: string]: any } = {
  AppBaseComponent
};

/**
 * 注册全局组件
 */
Object.keys(components).forEach(k => Vue.component(k, components[k]));
```

## main.ts

```typescript
import '@/components/base';
```
