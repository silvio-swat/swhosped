require('dotenv').config({ path: './.env' });

module.exports = {
  apps: [
    {
      name: 'nest-backend',
      script: './main.js',
      env: {
        PORT: process.env.PORT,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
        NODE_ENV: 'production',
      },
    },
  ],
};
