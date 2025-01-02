module.exports = {
  apps: [
    {
      name: 'webfogfod-dev',
      script: './src/index.js',
      env_file: '.env.development',
    },
    {
      name: 'webfogfod-prod',
      script: './src/index.js',
      env_file: '.env.production',
    },
  ],
};