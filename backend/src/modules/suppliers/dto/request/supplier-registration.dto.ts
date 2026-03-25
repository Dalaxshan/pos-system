import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SupplierRegistrationDto {
  @ApiProperty({
    description: 'The name of the supplier',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email of the company',
    example: 'infor@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The contact number of the supplier',
    example: '09123456789',
  })
  @IsNotEmpty()
  @IsString()
  contactNumber: string;

  @ApiProperty({
    description: 'The registered date of the supplier',
    example: '2024-09-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  regDate: Date;

  @ApiProperty({
    description: 'The address of the supplier',
    example: '123 Main St.',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'The name of the company',
    example: 'the ABC company',
  })
  @IsOptional()
  companyName: string;

  @ApiProperty({
    description: 'The name of the company',
    example: 'the ABC company',
  })
  @IsOptional()
  supplierId: string;
}
