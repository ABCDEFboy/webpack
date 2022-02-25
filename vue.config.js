const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const SpritesmithPlugin = require('webpack-spritesmith');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');

const config = require('./config/config.ts');
// const proxy = require('./src/base/dev-proxy/index');

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  require('./plugins/write-version');
}

// 编译配置的多页面
const modules = {};
// 编译配置得雪碧图
const spritePlugins = [];

// 根据当前所选模块初始化页面参数
// isSingle 在开发环境并且只运行一个项目时才为 true，主要为了方便直接访问 index.html 而不需要手动添加相应模块的 html 路径
function initPageParams(page, isSingle = false) {
  // 初始化多页打包模块
  modules[page] = {
    title: page,
    entry: `src/modules/${page}/main.ts`, // page 的入口
    template: `src/modules/${page}/${page}.html`, // 模板来源
    filename: `${isSingle ? 'index' : page}.html`, // 在 page.html 的输出
    // 在这个页面中包含的块，默认情况下会包含
    // 提取出来的通用 chunk 和 vendor chunk。
    chunks: ['chunk-vendors', 'chunk-common', page]
  };

  // 初始化雪碧图
  const spriteConfig = config.sprites[page];

  if (!spriteConfig) {
    throw new Error(
      `缺少 ${page} 模块的雪碧图配置，请在 /config/config.ts 中定义`
    );
  }
  spritePlugins.push(
    new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, spriteConfig.src),
        glob: '*.png'
      },
      target: {
        image: path.resolve(__dirname, spriteConfig.target.image),
        css: [path.resolve(__dirname, spriteConfig.target.css)]
      },
      apiOptions: {
        cssImageRef: spriteConfig.apiOptions.cssImageRef
      },
      spritesmithOptions: {
        algorithm: 'top-down'
      }
    })
  );
}

if (!isProduction) {
  // 可以运行指定项目
  // 单个：npm run serve index
  // 多个：npm run serve index,famous_teacher
  // 所有：npm run serve
  const argv = require('minimist')(process.argv.slice(2));
  const specifyPages = typeof argv.p === 'string' ? argv.p.split(',') : [];
  const pages =
    Array.isArray(specifyPages) && specifyPages.length
      ? specifyPages
      : config.buildPages;
  for (const page of pages) {
    initPageParams(page, pages.length === 1);
  }
} else {
  const page = process.env.page;
  initPageParams(page);
}

console.log(modules);
module.exports = {
  pages: modules, // 多页
  publicPath: './',
  productionSourceMap: false, // 打包时不要map文件
  outputDir: 'dist/web', // 输出文件目录
  lintOnSave: true, // 是否在保存的时候检查
  assetsDir: isProduction ? process.env.page : 'statics', // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  devServer: {
    host: '0.0.0.0',
    open: false,
    compress: true,
    hotOnly: true,
    port: 8080
    // proxy
  },
  css: {
    extract: isProduction,
    sourceMap: !isProduction,
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: ['> 1%', 'last 2 versions']
          })
        ]
      }
    },
    requireModuleExtension: true
  },

  configureWebpack: config => {
    const plugins = [];
    let isCopy = true;
    if (isProduction) {
      const argv = require('minimist')(process.argv.slice(2));
      // 正式环境下，copyWebpackPlugin 只需要运行一次
      // 因此当构建多个项目时，构建第一个项目回存在 first 参数(/build/build.ts)，所以后面的项目都为 false
      isCopy = argv._.pop() === 'first';
    }

    if (isCopy) {
      plugins.push(
        new CopyWebpackPlugin([
          // 先把根目录的statics拷贝到打包目录下的statics
          {
            from: path.resolve(__dirname, './statics/'),
            to: './statics/'
          },

          // 先把src/base/的statics拷贝到打包目录下的statics
          {
            from: path.resolve(__dirname, './src/base/statics/'),
            to: './statics/'
          }
        ])
      );
    }

    plugins.push(...spritePlugins);

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
