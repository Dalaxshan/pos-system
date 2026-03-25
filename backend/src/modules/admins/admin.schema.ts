import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/common/enums/role.enum';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true, versionKey: false })
export class Admin {
  @ApiProperty({ description: 'The name of the admin user', example: 'John Doe' })
  @Prop({
    required: true,
  })
  name: string;

  @ApiProperty({ description: 'The email address of the admin user', example: 'admin@example.com' })
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @ApiProperty({
    description: 'The password of the admin user',
    example: 'secret',
    writeOnly: true,
  })
  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @ApiProperty({ description: 'The role of the admin user', enum: Role, example: Role.Admin })
  @Prop({ type: String, enum: Role, default: Role.Admin })
  role: Role;

  @ApiProperty({
    description: 'The refresh token for the admin user',
    example: 'some-refresh-token',
    writeOnly: true,
  })
  @Prop()
  refreshToken: string;

  @Prop()
  status: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
