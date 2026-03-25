import { AWSConfigProps } from './config.interface';

export const awsConfig = (): AWSConfigProps => ({
  s3Bucket: process.env.AWS_S3_BUCKET,
  accessKey: process.env.AWS_ACCESS_KEY,
  secretKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});
