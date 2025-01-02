module.exports = {
  apps: [
    {
      name: 'webfogfod-dev',
      script: './src/index.js',
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'webfogfod-prod',
      script: './src/index.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};