const execSync = require('child_process').execSync;

const packRefs = ['origin/develop', 'origin/master', 'origin/release'];
const refName = execSync('git show -s --format=%d')
  .toString()
  .trim();

const isAllow = packRefs.some(ref => refName.includes(ref));
if (!isAllow) {
  throw new Error('请切换到 develop|master|release 分支打包!');
}
