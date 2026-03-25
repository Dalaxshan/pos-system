import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateAdminTokenDto {
  @ApiProperty({
    description: 'The email address of the admin. It must be a valid email format.',
    example: 'admin@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'The refresh token used to update the admin’s authentication token.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string;
}
