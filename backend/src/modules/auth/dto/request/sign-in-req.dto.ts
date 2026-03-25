import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInRequestDto {
  @ApiProperty({
    description: 'The email address of the user. It must be a valid email format.',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'The password associated with the user’s account.',
    example: 'StrongP@ssw0rd',
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
