import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp-relay.brevo.com',
        port: Number('587'),
        secure: false,
        auth: {
          user: 'hello@diwerse.com',
          pass: 'kMtVA68wvjTh79Pc',
        },
      },
      defaults: {
        from: '"Diwerse" <hello@diwerse.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
