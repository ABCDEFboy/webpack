# 模型层 Model

## 说明

该文件应该包含 `fetch.ts`:

文档地址：[@ava/fetch](http://192.168.16.44:8080/fetch)

```ts
import { Fetch } from '@ava/fetch';

export default new Fetch({
  // ... Fetch 的配置
});
```

## 然后使用 @ava/api-generator 生成类型定义文件以及请求方法

文档地址：[@ava/api-generator](http://192.168.16.44/dev-ops/api-generator/start.html)

## 目录结构

经过上面的操作后，目录结构将会如下所示

## 目录结构

```bash
├─fetch.ts
├─basic-params.ts
├─basic-response.ts
└─basic.ts
```
