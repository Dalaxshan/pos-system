import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventPayloads } from '../event-emitters/interface/event-types.interface';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  @OnEvent('user.welcome')
  async emailConfirmation(data: EventPayloads['user.welcome']): Promise<void> {
    const { email, name } = data;

    const subject = `Welcome to Company: ${name}`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './confirm-email',
      context: {
        user_firstname: 'Safraz Nazar',
        confirm_link: 'http://localhost:3000',
      },
    });

    Logger.log(`Email sent to ${email}`);
  }

  @OnEvent('client.email-verification')
  async clientEmailVerification(data: EventPayloads['client.email-verification']): Promise<void> {
    const { name, email, token } = data;

    const subject = `Welcome to Diwerse: ${name}`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './confirm-email',
      context: {
        user_firstname: name,
        confirm_link: 'https://www.diwerse.com/verify-email?token=' + token,
      },
    });

    Logger.log(`Email sent to ${email}`);
  }

  @OnEvent('client.forgot-password')
  async clientForgotPassword(data: EventPayloads['client.forgot-password']): Promise<void> {
    const { name, email, forgotPasswordToken } = data;

    const subject = `Password Reset Request: ${name}`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './forgot-password',
      context: {
        user_firstname: name,
        confirm_link: 'https://www.diwerse.com/forgot-password?token=' + forgotPasswordToken,
      },
    });

    Logger.log(`Email sent to ${email}`);
  }

  async welcomeEmail(email: string, name: string): Promise<void> {
    const subject = `Welcome to Maki POS: ${name}`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './confirm-email',
      context: {
        user_firstname: 'Safraz Nazar',
        confirm_link: 'http://localhost:3000',
      },
    });
  }

  @OnEvent('item.send-item-summary-email')
  async sendOrderSummaryEmail(data: EventPayloads['item.send-item-summary-email']): Promise<void> {
    const subject = 'Item Summary';

    await this.mailerService.sendMail({
      to: data.email,
      subject,
      template: './item-summary',
      context: {
        items: data.items,
      },
    });
  }
}
