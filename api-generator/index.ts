import { generate } from '@ava/api-generator';
import { Options } from '@ava/api-generator';

/**
 * @example
 * 文档地址：http://192.168.199.249/dev-ops/api-generator/start.html
 *
 * 下面是一个基础示例，建议看文档
 * {
 *    name: 'basic',
 *    service: 'asean-basic',
 *    url: 'http://192.168.35.224/api/basic/',
 *    outputDir: 'src/models',
 *    override: true
 * }
 */
const configList: Options[] = [
  /**
   * 配置可以单独抽出来
   * 在当前目录下新建 basic.ts
   *
   * export default basicConfig: Options = { ... }
   */
  // basicConfig,
  // componentConfig,
  // learnConfig,
  // videoConfig,
  // userConfig,
  // liveConfig
];

/**
 * 通过下面的处理我们可以用下面的方式更新接口
 *
 * 1. `npm run generate` 更新所有接口
 * 2. `npm run generate basic` 只更新 basic 服务的接口
 * 3. `npm run generate basic,learn` 只更新 basic 和 learn 的接口
 */
const targetServices = process.argv[2] ? process.argv[2].split(',') : [];

let activatedList: Options[] = [];
const serviceNameList = configList.map(v => v.name);

if (Array.isArray(targetServices) && targetServices.length > 0) {
  if (
    Array.from(new Set([...targetServices, ...serviceNameList])).length !==
    serviceNameList.length
  ) {
    throw new Error(
      `[@ava/api-generator]: 服务名称必需是 ${serviceNameList.join(', ')} 之一`
    );
  }
  targetServices.forEach(name => {
    const target = configList.find(config => config.name === name);
    target && activatedList.push(target);
  });
} else {
  activatedList = configList;
}

async function generateAPI() {
  for (const config of activatedList) {
    await generate(config);
  }
}

generateAPI();
