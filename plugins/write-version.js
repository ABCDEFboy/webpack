const packageJson = require('../package.json');
const path = require('path');
const fs = require('fs');

function formatDate(date, formats = 'Y-m-d') {
  function zero(value) {
    if (value < 10) {
      return `0${value}`;
    }
    return value;
  }

  const year = date.getFullYear();
  const month = zero(date.getMonth() + 1);
  const day = zero(date.getDate());

  const hour = zero(date.getHours());
  const minute = zero(date.getMinutes());
  const second = zero(date.getSeconds());

  return formats.replace(/Y|m|d|H|i|s/gi, (matches) => {
    const result = {
      Y: `${year}`,
      m: `${month}`,
      d: `${day}`,
      H: `${hour}`,
      i: `${minute}`,
      s: `${second}`,
    };
    return result[matches];
  });
}

const versionStr = `${packageJson.version}(${formatDate(new Date())})`;
try {
  fs.writeFileSync(path.resolve(__dirname, '../public/version'), versionStr);
  console.log(`生成 version 成功: ${versionStr}`);
} catch (e) {
  console.error('未能生成 version');
}
