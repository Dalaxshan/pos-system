import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EmailService } from './email.service';

@ApiTags('Email')
@Controller('mail')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post()
  @ApiOperation({ summary: 'Send a test welcome email' })
  async emailTest(): Promise<void> {
    return this.emailService.welcomeEmail('safraznazar0@gmail.com', 'Safraz');
  }
}
