import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { ConfigModule } from '@nestjs/config';
import { awsConfig } from 'src/configs/aws.config';

@Module({
  imports: [ConfigModule.forFeature(awsConfig)],
  controllers: [FileUploadController],
  exports: [FileUploadService],
  providers: [FileUploadService],
})
export class FileUploadModule {}
