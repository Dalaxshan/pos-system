import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthTokenDto {
  @ApiProperty({
    description: 'The access token used for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    type: String,
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: 'The refresh token used to obtain a new access token',
    example: 'd2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2',
    type: String,
  })
  @IsString()
  refreshToken: string;
}
