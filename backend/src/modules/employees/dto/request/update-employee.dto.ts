import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, Length, IsOptional, IsEnum } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class UpdateEmployeeDto {
  @ApiPropertyOptional({
    description: 'The name of the employee',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
  name?: string;

  @ApiPropertyOptional({
    description: 'The employee registration date',
    example: '2024-09-01T00:00:00.000Z',
  })
  @IsOptional()
  RegisterDate?: Date;

  @ApiPropertyOptional({
    description: 'The employee registration date',
    example: '2024-09-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'The address of the employee',
    example: '123 Main St. downTown',
  })
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'The contact number of the employee',
    example: '09123456789',
  })
  @IsOptional()
  contactNo?: string;

  @ApiPropertyOptional({
    description: 'The NIC of the employee',
    example: '123456789V',
  })
  @IsOptional()
  @IsString()
  nic: string;

  @ApiPropertyOptional({
    description: 'The role of the employee',
    example: 'Admin',
    enum: Object.values(Role),
  })
  @IsEnum(Role)
  role: string;

  @ApiPropertyOptional({
    description: 'The password of the employee',
    example: 'password',
  })
  password: string;

  @ApiPropertyOptional({
    description: 'The image of the employee',
    example: 'image.jpg',
  })
  @IsString()
  @IsOptional()
  profilePhoto?: string;
}
