import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplierSchema } from './supplier.schema';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { FileUploadModule } from 'src/common/file-upload/file-upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Supplier', schema: SupplierSchema }]),
    FileUploadModule,
  ],
  controllers: [SupplierController],
  exports: [SupplierService, MongooseModule],
  providers: [SupplierService],
})
export class SupplierModule {}
