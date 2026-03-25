export interface ApiConfigProps {
  apiUrl: string;
  httpTimeout: number;
}

interface MongodbConfigProps {
  connectionString: string;
  databaseName: string;
}

export interface JwtConfigProps {
  secret: string;
  refreshSecret: string;
  emailVerificationSecret: string;
  forgotPasswordSecret: string;
}

export interface ConfigProps {
  port: number;
  api: ApiConfigProps;
  mongodb: {
    database: MongodbConfigProps;
  };
  jwt: JwtConfigProps;
}

export interface AWSConfigProps {
  s3Bucket: string;
  accessKey: string;
  secretKey: string;
  region: string;
}

export interface SMTPConfigProps {
  host: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  sender: string;
}
