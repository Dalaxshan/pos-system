import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class UpdateEmployeeRoleDto {
  @ApiProperty({
    description: 'The role of the employee',
    example: 'Admin',
  })
  @IsEnum(Role, { message: 'Invalid Role' })
  role: Role;
}
