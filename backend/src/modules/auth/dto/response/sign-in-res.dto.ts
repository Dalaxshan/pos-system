import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { Types } from 'mongoose';

export class SignInResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the user.',
    example: '1234567890',
  })
  @IsNotEmpty({ message: 'User ID is required' })
  id: Types.ObjectId;

  @ApiProperty({
    description: 'Full name of the user.',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Email address of the user. It must be a valid email format.',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'JWT access token for authenticated requests.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @IsNotEmpty({ message: 'Access token is required' })
  accessToken: string;

  @ApiProperty({
    description: 'Role of the user in the system.',
    example: 'admin',
  })
  @IsNotEmpty({ message: 'Role is required' })
  role: Role;

  // @ApiProperty({
  //   description: 'Status of the user in the system.',
  //   example: 'active',
  // })
  // @IsOptional()
  // status?: UserStatus;

  @ApiPropertyOptional({
    description: 'JWT refresh token for obtaining a new access token.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @IsOptional()
  refreshToken?: string;
}
