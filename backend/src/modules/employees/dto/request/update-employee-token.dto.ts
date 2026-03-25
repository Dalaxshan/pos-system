import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateEmployeeTokenDto {
  @ApiProperty({})
  @IsEmail()
  email: string;

  @ApiProperty({})
  @IsNotEmpty()
  refreshToken: string;
}
