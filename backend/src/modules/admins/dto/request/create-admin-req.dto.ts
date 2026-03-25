import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAdminRequestDto {
  @ApiProperty({
    description: 'The name of the admin.',
    example: 'John Doe',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
  name: string;

  @ApiProperty({
    description: 'The email address of the admin. It must be a valid email format.',
    example: 'admin@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'The password for the admin account.',
    example: 'strongpassword123',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
