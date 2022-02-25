# Global Mixin

**谨慎使用**，一旦使用全局混入，它将影响**每一个**之后创建的 Vue 实例。

## index.ts

如果需要使用可以直接复制下面的代码到 index.ts 并扩展之

```typescript
import { Vue, Component } from 'vue-property-decorator';

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * 全局混入的属性及方法需要在这里声明，否则在相应组件中会找不到
     */
    variableFromMixins: string;

    methodFromMixins(value: string): void;
  }
}

@Component
export default class GlobalMixin extends Vue {
  variableFromMixins = '';

  methodFromMixins(value: string) {
    console.log('methods from mixin', value);
  }
}

Vue.mixin(GlobalMixin);
```

接下来在各个组件中直接使用就可以了，再次强调，**谨慎使用**
