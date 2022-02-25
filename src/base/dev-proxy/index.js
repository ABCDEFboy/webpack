/**
 * 数组元素中填写你需要代理的 uri 规则，务必以 ^ 作为开头，比如
 * '^/group1/*'
 */
const proxy = [
  '^/group1/*'
  // ... 在这里填写你需要代理的地址
].reduce((res, cur) => {
  res[cur] = {
    // VUE_APP_DEVELOP_SERVER 在 .env.development 中进行配置
    target: process.env.VUE_APP_DEVELOP_SERVER,
    changeOrigin: true
  };
  return res;
}, {});

module.exports = proxy;
