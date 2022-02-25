const path = require('path');
const fs = require('fs');
const tar = require('tar-fs');
const zlib = require('zlib');

const options = {
  // 打包包名
  packName: 'web'
};

function deleteFile(delPath, direct) {
  delPath = direct ? delPath : path.join(__dirname, delPath);
  try {
    /**
     * @des 判断文件或文件夹是否存在
     */
    if (fs.existsSync(delPath)) {
      fs.unlinkSync(delPath);
    } else {
      console.log('inexistence path：', delPath);
    }
  } catch (error) {
    console.log('del error', error);
  }
}

function deleteFolder(delPath) {
  // delPath = path.join(__dirname, delPath);
  try {
    if (fs.existsSync(delPath)) {
      const delFn = function(address) {
        const files = fs.readdirSync(address);
        for (let i = 0; i < files.length; i++) {
          const dirPath = path.join(address, files[i]);
          if (fs.statSync(dirPath).isDirectory()) {
            delFn(dirPath);
          } else {
            deleteFile(dirPath, true);
          }
        }
        /**
         * @des 只能删空文件夹
         */
        fs.rmdirSync(address);
      };
      delFn(delPath);
    } else {
      console.log('do not exist: ', delPath);
    }
  } catch (error) {
    console.log('del folder error', error);
  }
}

function copyFolder(copiedPath, resultPath, direct) {
  console.log(`复制文件路径:${copiedPath}`, `目标文件路径:${resultPath}`);
  if (!direct) {
    copiedPath = path.join(__dirname, copiedPath);
    resultPath = path.join(__dirname, resultPath);
  }

  function createDir(dirPath) {
    fs.mkdirSync(dirPath);
  }

  if (fs.existsSync(copiedPath)) {
    createDir(resultPath);
    /**
     * @des 方式一：利用子进程操作命令行方式
     */
    // child_process.spawn('cp', ['-r', copiedPath, resultPath])

    /**
     * @des 方式二：
     */
    const files = fs.readdirSync(copiedPath, { withFileTypes: true });
    for (let i = 0; i < files.length; i++) {
      const cf = files[i];
      const ccp = path.join(copiedPath, cf.name);
      const crp = path.join(resultPath, cf.name);
      // 判断是文件 就直接复制
      if (cf.isFile()) {
        fs.writeFileSync(crp, fs.readFileSync(ccp));
      } else {
        try {
          /**
           * @des 判断读(R_OK | W_OK)写权限
           */
          fs.accessSync(path.join(crp, '..'), fs.constants.W_OK);
          copyFolder(ccp, crp, true);
        } catch (error) {
          console.log('folder write error:', error);
        }
      }
    }
  } else {
    console.log('do not exist path: ', copiedPath);
  }
}

function pack() {
  if (!fs.existsSync(path.resolve(__dirname, './temp'))) {
    console.log('没有temp文件夹，创建temp目录...');
    fs.mkdirSync(path.resolve(__dirname, './temp'));
  }
  const packageDir = path.resolve(__dirname, `temp/${options.packName}`);
  if (!fs.existsSync(packageDir)) {
    console.log(`不存在${`temp/${options.packName}`}文件夹`);
  } else {
    deleteFolder(packageDir);
  }
  copyFolder(path.resolve(__dirname, '../dist'), packageDir, true);

  tar
    .pack(path.resolve(__dirname, 'temp'), {
      finish: function() {
        console.log('压缩tar.gz文件');
        let frReader = fs
          .createReadStream(path.resolve(__dirname, options.packName + '.tar'))
          .pipe(zlib.createGzip())
          .pipe(
            fs.createWriteStream(
              path.resolve(__dirname, options.packName + '.tar.gz')
            )
          );
        frReader.on('finish', () => {
          console.log('成功压缩tar.gz文件');
        });
      }
    })
    .pipe(
      fs.createWriteStream(path.resolve(__dirname, options.packName + '.tar'))
    );
}

pack();
