import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchSchema } from './branch.schema';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { EmployeeModule } from '../employees/employee.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Branch', schema: BranchSchema }]), EmployeeModule],
  controllers: [BranchController],
  exports: [BranchService],
  providers: [BranchService],
})
export class BranchModule {}
