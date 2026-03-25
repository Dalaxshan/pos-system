import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminResponseDto {
  @ApiProperty({
    description: 'The name of the newly created admin.',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The email address of the newly created admin.',
    example: 'john.doe@example.com',
  })
  email: string;
}
