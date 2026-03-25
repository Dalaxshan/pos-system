import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeSchema } from './employee.schema';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { FileUploadModule } from 'src/common/file-upload/file-upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Employee', schema: EmployeeSchema }]),
    FileUploadModule,
  ],
  controllers: [EmployeeController],
  exports: [EmployeeService],
  providers: [EmployeeService],
})
export class EmployeeModule {}
