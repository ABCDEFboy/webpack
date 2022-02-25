const chokidar = require('chokidar');
const chalk = require('chalk');
const path = require('path');
const Mock = require('mockjs');

const mockDir = path.join(process.cwd(), 'mock');
const mockUrlScript = path.join(process.cwd(), 'mock/mock-url.js');
let replaceStartIndex = 0;

function getMockUrlList(isHotReload = true) {
  try {
    Object.keys(require.cache).forEach(k => {
      if (k.includes(mockUrlScript)) {
        delete require.cache[require.resolve(k)];
      }
    });
    const urlData = require('./mock-url');
    if (isHotReload) {
      console.log(chalk.magentaBright('\n > Mock Url hot reload success!'));
    }
    return urlData.map(item => new RegExp(item));
  } catch (error) {
    console.log(chalk.redBright(error));
  }
}

let mockUrlList = getMockUrlList(false);

function mockInterceptor() {
  return (req, res, next) => {
    if (
      !req.url.startsWith('/mock') &&
      mockUrlList.some(reg => reg.test(req.url))
    ) {
      req.url = '/mock' + req.url;
    }
    next();
  };
}

const responseFake = (url, type, respond) => {
  return {
    url: new RegExp(url),
    type: type || 'get',
    response(req, res) {
      res.json(
        Mock.mock(respond instanceof Function ? respond(req, res) : respond)
      );
    }
  };
};

function registerRoutes(app) {
  let mockLastIndex;
  const { mocks } = require('./index.js');
  const mocksForServer = mocks.map(route =>
    responseFake(route.url, route.type, route.response)
  );
  for (const mock of mocksForServer) {
    app[mock.type](mock.url, mock.response);
    mockLastIndex = app._router.stack.length;
  }
  const mockRoutesLength = mocksForServer.length;
  if (replaceStartIndex === 0) {
    replaceStartIndex = mockLastIndex - mockRoutesLength;
  }
  return {
    mockRoutesLength: mockRoutesLength,
    mockStartIndex: mockLastIndex - mockRoutesLength
  };
}

function unregisterRoutes() {
  Object.keys(require.cache).forEach(k => {
    if (k.includes(mockDir)) {
      delete require.cache[require.resolve(k)];
    }
  });
}

// 替换 express mock 路由缓存到原来的位置
function replaceExpressRouter(app, startIndex, mockRoutesLength) {
  const deletedList = app._router.stack.splice(startIndex, mockRoutesLength);
  app._router.stack.splice(replaceStartIndex, 0, ...deletedList);
}

module.exports = app => {
  // parse app.body
  // https://expressjs.com/en/4x/api.html#req.body
  // app.use(json());
  // app.use(
  //   urlencoded({
  //     extended: true
  //   })
  // );
  app.use(mockInterceptor());

  let { mockRoutesLength, mockStartIndex } = registerRoutes(app);

  chokidar.watch(mockUrlScript).on('all', event => {
    if (event === 'change' || event === 'add') {
      mockUrlList = getMockUrlList();
    }
  });

  chokidar
    .watch(mockDir, {
      ignored: /mock-server|mock-url|README/,
      ignoreInitial: true
    })
    .on('all', (event, path) => {
      if (event === 'change' || event === 'add') {
        try {
          app._router.stack.splice(replaceStartIndex, mockRoutesLength);

          unregisterRoutes();

          const mockRoutes = registerRoutes(app);
          mockRoutesLength = mockRoutes.mockRoutesLength;
          mockStartIndex = mockRoutes.mockStartIndex;

          console.log(
            chalk.magentaBright(
              `\n > Mock Server hot reload success! changed  ${path}`
            )
          );

          replaceExpressRouter(app, mockStartIndex, mockRoutesLength);
        } catch (error) {
          console.log(chalk.redBright(error));
        }
      }
    });
};
