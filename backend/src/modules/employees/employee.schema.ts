import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';
import { InvoiceNumber } from 'invoice-number';
import { HydratedDocument } from 'mongoose';

export type EmployeeDocument = HydratedDocument<Employee>;

@Schema({ timestamps: true })
export class Employee {
  @ApiProperty({
    description: 'Employee Id',
    example: 'EMP-MAK-0001',
  })
  @Prop({ unique: true })
  employeeId: string;

  @ApiProperty({
    description: 'The name of the employee',
    example: 'John Doe',
  })
  @Prop({
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'The employee registration date',
    example: '2024-09-01T00:00:00.000Z',
  })
  @Prop({
    type: Date,
  })
  RegisterDate: Date;

  @ApiProperty({
    description: 'The address of the employee',
    example: '123 Main St. downTown',
  })
  @Prop()
  address: string;

  @ApiProperty({
    description: 'The contact number of the employee',
    example: '09123456789',
  })
  @Prop()
  contactNo: string;

  @ApiProperty({
    description: 'The profile photo URL of the employee',
    example: 'https://example.com/profile.jpg',
  })
  @Prop()
  profilePhoto: string;

  @ApiProperty({
    description: 'The role of the employee',
    enum: Role,
    example: Role.Admin,
  })
  @Prop({
    type: String,
    enum: Role,
    required: true,
  })
  role: Role;

  @ApiProperty({
    description: 'The email address of the employee',
    example: 'admin@gmail.com',
  })
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @ApiProperty({
    description: 'The NIC (National Identity Card) of the employee',
    example: '123456789V',
  })
  @Prop()
  nic: string;

  @ApiProperty({
    description: 'The password of the employee',
    example: 'password',
    writeOnly: true,
  })
  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @ApiProperty({
    description: 'The refresh token of the employee',
    example: 'some-refresh-token',
  })
  @Prop()
  refreshToken: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

EmployeeSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }
  const lastEmployee = await this.model('Employee').findOne({}).sort({ _id: -1 }).exec();
  if (!lastEmployee || !(lastEmployee as unknown as Employee).employeeId) {
    this.employeeId = `EM-MAK-0001`;
  } else {
    const pattern = InvoiceNumber.next((lastEmployee as unknown as Employee).employeeId);
    this.employeeId = pattern;
  }
  next();
});
