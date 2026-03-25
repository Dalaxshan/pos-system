import { ConfigProps } from './config.interface';

export const config = (): ConfigProps => ({
  port: parseInt(process.env.PORT, 10),
  api: {
    apiUrl: process.env.API_URL,
    httpTimeout: 1000,
  },
  mongodb: {
    database: {
      connectionString: process.env.MONGODB_CONNECTION_STRING,
      databaseName: process.env.MONGODB_DB_NAME,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    emailVerificationSecret: process.env.JWT_EMAIL_VERIFICATION_SECRET,
    forgotPasswordSecret: process.env.JWT_FORGOT_PASSWORD_SECRET,
  },
});
