const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const spritesmithPlugin = require('./plugins/spritesmith');

if (process.env.NODE_ENV === 'production') {
  require('./plugins/write-version');
}

/**
 * 数组元素中填写你需要代理的 uri 规则，务必以 ^ 作为开头，比如
 * '^/group1/*'
 * '^/storage-service/*'
 */
const proxy = [
  // ... 在这里填写你需要代理的地址
].reduce((res, cur) => {
  res[cur] = {
    // VUE_APP_DEVELOP_SERVER 在 .env.development 中进行配置
    target: process.env.VUE_APP_DEVELOP_SERVER,
    changeOrigin: true
  };
  return res;
}, {});

module.exports = {
  assetsDir: 'statics',
  publicPath: './',
  productionSourceMap: false,
  devServer: {
    before: app => {
      if (process.env.VUE_APP_MOCK) {
        const mockServer = require('./mock/mock-server.js');
        mockServer(app);
      }
    },
    host: '0.0.0.0',
    open: false,
    compress: true,
    hotOnly: true,
    port: 8080
    // proxy
  },
  configureWebpack: config => {
    const plugins = [];
    plugins.push(spritesmithPlugin);

    if (process.env.npm_config_report) {
      plugins.push(new BundleAnalyzerPlugin());
    }

    config.plugins = [...config.plugins, ...plugins];
  },
  pluginOptions: {
    /**
     * 全局 scss 变量配置
     * @param {string | string[]} patterns 你想要全局注册的 scss 变量
     */
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/assets/styles/variables/*.scss'),
        path.resolve(__dirname, 'src/assets/styles/mixins/*.scss')
      ]
    }
  }
};
