module.exports = (api) => {
  api.cache(true);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          loose: true,
          modules: false,
        },
      ],
    ],
    plugins: [
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-transform-async-to-generator',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-throw-expressions',
      '@babel/plugin-syntax-class-properties',
      ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
  };
};
