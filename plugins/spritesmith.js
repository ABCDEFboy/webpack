const path = require('path');
const SpritesmithPlugin = require('webpack-spritesmith');

module.exports = new SpritesmithPlugin({
  src: {
    cwd: path.resolve(__dirname, '../src/assets/icons'),
    glob: '*.png'
  },
  target: {
    image: path.resolve(__dirname, '../src/assets/sprites/sprites.png'),
    css: [
      [
        path.resolve(__dirname, '../src/assets/sprites/sprites.scss'),
        {
          format: 'handlebars_based_template',
          spritesheetName: 'icon'
        }
      ]
    ]
  },
  customTemplates: {
    handlebars_based_template: path.resolve(
      __dirname,
      'sprites_template.handlebars'
    )
  },
  apiOptions: {
    cssImageRef: './sprites.png'
  },
  spritesmithOptions: {
    algorithm: 'binary-tree',
    padding: 10
  }
});
