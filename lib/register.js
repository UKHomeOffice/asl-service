require('@babel/register')({
  ignore: [],
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        targets: {
          ie: 11
        }
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread'
  ]
});
