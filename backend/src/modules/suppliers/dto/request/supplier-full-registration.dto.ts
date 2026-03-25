import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';

export class SupplierFullRegistrationDto {
  //personal information
  @ApiProperty()
  @IsNotEmpty()
  @IsString({ message: '  Name must be a string' })
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contactNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  regDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  supplierId: string;
}
