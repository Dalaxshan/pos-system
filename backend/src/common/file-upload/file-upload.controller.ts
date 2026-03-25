import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';

@Controller('file-upload')
@ApiTags('File Upload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Post()
  @ResponseMessage('File uploaded successfully')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Upload files to S3' })
  @ApiResponse({
    status: 201,
    description: 'The files have been successfully uploaded.',
    type: [String],
  })
  @ApiConsumes('multipart/form-data')
  async uploadFileTest(@UploadedFiles() files: Express.Multer.File[]): Promise<string[]> {
    return this.fileUploadService.uploadFilesToS3(files);
  }
}
