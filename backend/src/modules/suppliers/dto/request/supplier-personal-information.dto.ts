import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class SupplierRegistrationPersonalInformationDto {
  @ApiProperty()
  @IsEmail()
  supplierEmail: string;

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
}
