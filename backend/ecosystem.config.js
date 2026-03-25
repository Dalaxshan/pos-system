module.exports = {
  apps: [
    {
      name: 'mak-be',
      script: 'main.js',
      env: {
        NODE_ENV: 'development',
      },
      watch: true,
      env_file: '.env.development',
    },
    {
      name: 'mak-be-p',
      script: 'main.js',
      env: {
        NODE_ENV: 'production',
      },
      watch: true,
      env_file: '.env.production',
    },
  ],
};
