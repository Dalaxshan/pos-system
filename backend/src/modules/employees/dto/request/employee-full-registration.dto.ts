import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  IsEnum,
  Matches,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class EmployeeFullRegistrationDto {
  @ApiProperty({
    description: 'The name of the employee',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString({ message: 'Name must be a string' })
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
  name: string;

  @ApiProperty({
    description: 'The employee registration date',
    example: '2024-09-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  RegisterDate: Date;

  @ApiProperty({
    description: 'The address of the employee',
    example: '123 Main St. downTown',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'The contact number of the employee',
    example: '09123456789',
  })
  @IsNotEmpty()
  @IsString()
  contactNo: string;

  @ApiProperty({
    description: 'The role of the employee',
    example: 'Admin',
    enum: Object.values(Role),
  })
  @IsEnum(Role)
  role: string;

  @ApiProperty({
    description: 'The email of the employee',
    example: 'admin@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The NIC of the employee',
    example: '123456789V',
  })
  @IsOptional()
  @IsString()
  nic: string;

  @ApiProperty({
    description: 'The password of the employee',
    example: 'P@ssw0rd!',
  })
  @IsNotEmpty()
  @IsString({ message: 'Password must be a string' })
  @Length(8, 255, { message: 'Password must be between 8 and 255 characters' })
  @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, {
    message: 'Password must contain at least one special character',
  })
  password: string;
}
