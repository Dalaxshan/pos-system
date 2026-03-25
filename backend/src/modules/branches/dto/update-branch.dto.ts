import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBranchDto {
  @ApiProperty({
    example: 'Branch 1',
    description: 'name of the branch',
  })
  @IsNotEmpty()
  @IsString({ message: 'Name must be a string' })
  branchName: string;

  @ApiProperty({
    example: '101/42D, chithra lane',
    description: 'address of the branch',
  })
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: '01122305523',
    description: 'contact number of the branch',
  })
  @IsNotEmpty()
  contactNo: string;

  @ApiProperty({
    description: 'emial of the branch',
    example: 'branch@gmail.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '66a22540e160fa4c2c0ec372',
    description: 'Manager id of the relevant branch',
  })
  @IsNotEmpty()
  employeeId: string;
}
