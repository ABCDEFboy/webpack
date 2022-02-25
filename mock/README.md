# mock-server

## 概述

在开发环境中使用 mock-server，具有实时显示虚拟数据、mock 非侵入式、动态更新需要 mock 的 url 和返回的 mock data 优点。

## 原理

1. 由于 webpack-dev-server 是基于 express 服务器，在 before 函数可通过 `app.get('/url',callback)` 来匹配 url 执行对应的回调，通过在回调里添加 `mockjs` 返回的数据。

如：

```javascript
  // vue.config.js
  devServer: {
    before: (app, server, compiler) => {
      if (process.env.VUE_APP_MOCK) {
        // mockServer(app);  // 实际使用mockServer
        app.get('/mock/wj-basic/public/school/page', () => {
          res.json({
            success: true,
            'data|1-10': [{
              'id|+1': 1
            }]
          })
        })
      }
    },
    port: 8080,
    proxy
  },
```

2. 通过在中间件添加 `req.url` 前缀，可不走代理后台接口的模块，体现非侵入式的特点。
3. 使用 chokidar 监听指定的文件变化，替换 `app.\_router.stack` 接口路由，以及 `require.cache` 对应的引入。体现动态更新

## 用法

1. 在 `package.json` 的 scripts 加上命令行`"server:mock": "cross-env VUE_APP_MOCK=true vue-cli-service serve"`（已配置）
2. 在 devServer before 函数添加对应的 mockServer 文件（已配置）
3. 在 mock-url.js 编辑需要 mock 的 url
4. 在 mock-data 编辑要返回的接口 mock 数据
