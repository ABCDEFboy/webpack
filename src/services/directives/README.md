# Global Directives

## 目录结构

```
├─index.ts
├─directive-name-1.ts
└─directive-name-2.ts
```

## index.ts

```typescript
import './directive-name-1';
import './directive-name-2';
```

## directive-name-1.ts

```typescript
import Vue from 'vue';

Vue.directive('directive-name-1', {
  // 你的代码
});

export default Vue.directive('directive-name-1');
```

## directive-name-2.ts

```typescript
import Vue from 'vue';

Vue.directive('directive-name-2', {
  // 你的代码
});

export default Vue.directive('directive-name-2');
```

## main.ts

```typescript
import '@/services/directives';
```