module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'ava-ui',
        styleLibraryName: '~src/assets/ava-ui/theme'
      }
    ]
  ]
};
