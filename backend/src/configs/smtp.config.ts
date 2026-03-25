import { SMTPConfigProps } from './config.interface';

export const smtpConfig = (): SMTPConfigProps => ({
  host: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT, 10),
  smtpUsername: process.env.SMTP_USERNAME,
  smtpPassword: process.env.SMTP_PASSWORD,
  sender: process.env.SMTP_SENDER,
});
