module.exports = {
  '*.{html,vue,css,sass,scss}': [
    'stylelint --cache **/*.{html,vue,css,scss} --fix'
  ],
  '*.{ts,vue,js}': ['prettier --write', 'vue-cli-service lint']
};
