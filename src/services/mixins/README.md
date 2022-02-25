# Mixins

## 目录结构

```
├─MixinsName1.ts
└─MixinsName2.ts
```

因为 `export` 的是一个 `Class` 因此使用大写开头的驼峰命名

## mixins-name-1.ts

```typescript
import { Vue } from 'vue-property-decorator';

export default class TitleMixin extends Vue {
  title = 'title';

  methodsFromTitleMixin(value: string) {
    console.log('methods from title mixins', value);
  }
}
```

## mixins-name-2.ts

```typescript
import { Vue } from 'vue-property-decorator';

export default class NameMixin extends Vue {
  name = 'name';

  methodsFromNameMixin(value: string) {
    console.log('methods from name mixins', value);
  }
}
```

## single-mixin-component.ts

引入单个 Mixin

```typescript
import { Vue, Component, Mixins } from 'vue-property-decorator';
import TitleMixin from '@/services/mixins/TitleMixin';

@Component
export default class SingleMixin extends Mixins(TitleMixin) {
  created() {
    console.log(this.title);
  }
}
```

## multiple-mixins-component.ts

引入多个 Mixin

```typescript
import { Vue, Component, Mixins } from 'vue-property-decorator';
import TitleMixin from '@/services/mixins/TitleMixin';
import NameMixin from '@/services/mixins/NameMixin';

/**
 * Mixins(TitleMixin, NameMixin) 等同于 JavaScript 版本的 mixins: [TitleMixin, NameMixin]
 */
@Component
export default class MultipleMixins extends Mixins(TitleMixin, NameMixin) {
  created() {
    console.log(this.title);
  }
}
```
