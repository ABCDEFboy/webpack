/**
 * 你可以再 helper.js 中添加更多帮助函数去操作你的 mock data
 * mockUrl() 不建议修改，因为我们 mock 的 url 都会代理到 /mock/ 前缀的路由上，如果要改，别忘了改 mock-server 的相关逻辑
 */
function mockUrl(url) {
  return '/mock/' + url;
}

module.exports = {
  mockUrl
};
