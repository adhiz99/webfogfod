module.exports = {
    apps: [
      {
        name: 'webfogfod',
        script: './src/index.js', // File utama Express.js
        env_file: '.env.local',
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };