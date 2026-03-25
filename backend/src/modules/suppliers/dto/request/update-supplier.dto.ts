import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, Length, IsOptional } from 'class-validator';

export class UpdateSupplierDto {
  @ApiPropertyOptional({
    description: 'The name of the supplier',
    example: 'John Does',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
  name?: string;

  @ApiPropertyOptional({
    description: 'The email of the company',
    example: 'infor@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'The contact number of the supplier',
    example: '09123456789',
  })
  @IsOptional()
  contactNumber?: string;

  @ApiPropertyOptional({
    description: 'The name of the company',
    example: 'the ABC company',
  })
  @IsOptional()
  companyName?: string;

  @ApiPropertyOptional({
    description: 'The registered date of the supplier',
    example: '2024-09-01T00:00:00.000Z',
  })
  @IsOptional()
  regDate?: Date;

  @ApiPropertyOptional({
    description: 'The address of the supplier',
    example: '123 Main St.',
  })
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'The logo of the supplier',
    example: 'https://www.example.com/logo.png',
  })
  @IsString()
  @IsOptional()
  logo: string;

  @ApiPropertyOptional({
    description: 'The id of the supplier',
    example: '60f8b9d3d7e0a0001f000001',
  })
  @IsString()
  @IsOptional()
  supplierId?: string;
}
