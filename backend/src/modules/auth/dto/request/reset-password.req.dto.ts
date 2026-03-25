import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class ResetPasswordReqDto {
  @ApiProperty({
    description:
      'The new password that the user wants to set. Ensure it meets your password policy requirements.',
    example: 'NewStrongP@ssw0rd',
  })
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string;

  @ApiProperty({
    description:
      'The JWT token used to verify the user’s request for password reset. It must be a valid JWT.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @IsNotEmpty({ message: 'Forgot password token is required' })
  @IsJWT({ message: 'Forgot password token must be a valid JWT' })
  forgotPasswordToken: string;
}
