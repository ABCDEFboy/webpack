// 获取指定打包的模块
// 打包指定的单个项目示例 npm run build page1
// 打包指定的多个项目示例 npm run build page1,page2
// 如果要打包所有项目，不指定即可 npm run build
const glob = require('glob');
const argv = require('minimist')(process.argv.slice(2));
// 获取指定打包的目录
const specifyPages = typeof argv.p === 'string' ? argv.p.split(',') : [];
const sprites = {};
// 所有的打包目录
const allPages = [];

const globPath = ['./src/modules/**/*.html'];

globPath.forEach(itemPath => {
  glob.sync(itemPath).forEach(entry => {
    allPages.push(/\.\/\w+\/\w+\/(\w+)\/\w+\.\w+/gi.exec(entry)[1]);
  });
});

// 获取需要打包的目录
// 如果配置的打包单页为空，则打包全部
const buildPages =
  Array.isArray(specifyPages) && specifyPages.length ? specifyPages : allPages;

// 为所有目录配置精灵图
allPages.forEach(page => {
  sprites[page] = {
    src: `./src/modules/${page}/assets/images/icons`,
    target: {
      image: `./src/modules/${page}/assets/images/sprites.png`,
      css: `./src/modules/${page}/assets/styles/sprites.scss`
    },
    apiOptions: {
      cssImageRef: '../images/sprites.png'
    }
  };
});

module.exports = {
  buildPages,
  sprites,
  allPages
};
