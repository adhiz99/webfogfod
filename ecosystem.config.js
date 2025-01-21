module.exports = {
  apps: [
    {
      name: 'webfogfod-dev',
      script: './src/index.js',
      env: {
        NODE_ENV: 'development', // Tambahan variabel lingkungan
      },
      env_file: '.env.development',
    },
    {
      name: 'webfogfod-prod',
      script: './src/index.js',
      env: {
        NODE_ENV: 'production', // Tambahan variabel lingkungan
      },
      env_file: '.env.production',
    },
  ],
};