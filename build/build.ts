const fs = require('fs');
const execSync = require('child_process').execSync;
const config = require('../config/config.ts');
const chalk = require('chalk');
const pkg = require('../package.json');
const path = require('path');

// 格式化日期
function getFormatDate(date) {
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  let d = date.getDate();
  d = d < 10 ? '0' + d : d;
  let h = date.getHours();
  h = h < 10 ? '0' + h : h;
  let minute = date.getMinutes();
  minute = minute < 10 ? '0' + minute : minute;
  let second = date.getSeconds();
  second = second < 10 ? '0' + second : second;
  return `${y}${m}${d}${h}${minute}`;
}
// 移除目录
function deleteDist(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(file => {
      const curPath = path + '/' + file; // 拼接目录写文件完整路径
      if (fs.statSync(curPath).isDirectory()) {
        // 读取文件路径状态 判断是否为文件夹 如果为文件夹，递归
        deleteDist(curPath);
      } else {
        fs.unlinkSync(curPath); // 删除文件
      }
    });
    fs.rmdirSync(path);
  }
}

try {
  const startTime = Date.now();
  process.env.NODE_ENV = 'production'; // 切换环境为生产

  deleteDist('./dist');
  for (let i = 0; i < config.buildPages.length; i += 1) {
    const page = config.buildPages[i];
    // 记录当前打包的目录
    process.env.page = page;
    console.log(
      chalk.green(
        `开始构建 ${page} 项目，当前进度：${i}/${config.buildPages.length}`
      )
    );
    const startTime = Date.now();
    execSync(`npm run _build${i === 0 ? ` first` : ''}`, {
      stdio: 'inherit'
    });
    const time = Date.now() - startTime;
    console.log(
      chalk.green(
        `完成 ${page} 的构建，当前进度：${i + 1}/${
          config.buildPages.length
        }; ${page} is Compiled successfully in ${time / 1000}s`
      )
    );
  }
  const time = Date.now() - startTime;

  // 生成version文件
  const versionStr = `${pkg.version}(${getFormatDate(new Date())})`;
  try {
    fs.writeFileSync(path.join(__dirname, '../dist/web/version'), versionStr);
    console.log('生成version信息成功！');
  } catch (e) {
    console.log('写入version失败');
  }
  // 压缩
  execSync('cd dist && tar -czvf web.tar.gz web');
  console.log(chalk.green(`Compiled successfully in ${time / 1000}s`));
  // 重置
  process.env.NODE_ENV = undefined;
} catch (e) {
  console.log(e);
}
