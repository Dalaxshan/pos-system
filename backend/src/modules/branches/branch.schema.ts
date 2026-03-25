import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceNumber } from 'invoice-number';
import { Types, HydratedDocument } from 'mongoose';

export type BranchDocument = HydratedDocument<Branch>;

@Schema({ timestamps: true })
export class Branch {
  @ApiProperty({
    description: 'Id of the branch',
    example: 'BR-MAK-0001',
  })
  @Prop({ unique: true })
  branchId: string;

  @ApiProperty({
    description: 'Name of the branch',
    example: 'Branch 1',
  })
  @Prop({
    required: true,
  })
  branchName: string;

  @ApiProperty({
    description: 'Address of the branch',
    example: '101/42D, Chithra Lane',
  })
  @Prop({
    required: true,
  })
  address: string;

  @ApiProperty({
    description: 'Contact number of the branch',
    example: '01122305523',
  })
  @Prop({
    required: true,
  })
  contactNo: string;

  @ApiProperty({
    description: 'Email of the branch',
    example: 'branch@gmail.com',
  })
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @ApiProperty({
    description: 'Manager ID of the relevant branch',
    example: '66a22540e160fa4c2c0ec372',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Employee',
    required: false,
  })
  employeeId: Types.ObjectId;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);

BranchSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }
  const lastBranch = await this.model('Branch').findOne({}).sort({ _id: -1 }).exec();
  if (!lastBranch || !(lastBranch as unknown as Branch).branchId) {
    this.branchId = `BR-MAK-0001`;
  } else {
    const pattern = InvoiceNumber.next((lastBranch as unknown as Branch).branchId);
    this.branchId = pattern;
  }
  next();
});
