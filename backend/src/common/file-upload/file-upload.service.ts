import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { AWSConfigProps } from 'src/configs/config.interface';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService<AWSConfigProps>) {
    const region = this.configService.get<string>('region', {
      infer: true,
    });
    const accessKey = this.configService.get<string>('accessKey', {
      infer: true,
    });
    const secretKey = this.configService.get<string>('secretKey', {
      infer: true,
    });

    this.s3Client = new S3Client({
      region: region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });
  }

  async uploadFilesToS3(files: Express.Multer.File[], path?: string): Promise<string[]> {
    const fileUrls = [];

    for (const file of files) {
      const url = await this.uploadFile(file, path ?? null);
      fileUrls.push(url);
    }

    return fileUrls;
  }

  private async uploadFile(file: Express.Multer.File, path?: string): Promise<string> {
    const { originalname, buffer, mimetype } = file;
    const s3Bucket = this.configService.get<string>('s3Bucket', {
      infer: true,
    });
    const region = this.configService.get<string>('region', {
      infer: true,
    });

    const key = path ? `${path}/${Date.now()}-${originalname}` : `${Date.now()}-${originalname}`;

    const params = {
      Bucket: s3Bucket,
      Key: key,
      Body: buffer,
      ACL: ObjectCannedACL.public_read,
      ContentType: mimetype,
    };

    try {
      const command = new PutObjectCommand(params);
      await this.s3Client.send(command);
      return `https://s3.${region}.amazonaws.com/${s3Bucket}/${key}`;
    } catch (e) {
      this.logger.error('Error uploading file to S3', e.stack);
      throw new InternalServerErrorException('Error uploading file to S3');
    }
  }

  async deleteFileFromS3(fileUrl: string): Promise<void> {
    const s3Bucket = this.configService.get<string>('s3Bucket', {
      infer: true,
    });
    const parsedUrl = new URL(fileUrl);
    const pathSegments = parsedUrl.pathname.split('/');
    const fileName = decodeURIComponent(pathSegments.pop());

    const folderName = pathSegments.length > 2 ? pathSegments.pop() : null;
    const key = folderName ? `${folderName}/${fileName}` : fileName;
    const params = {
      Bucket: s3Bucket,
      Key: key,
    };

    try {
      const command = new DeleteObjectCommand(params);
      await this.s3Client.send(command);
      this.logger.log(`File ${fileName} deleted from S3.`);
    } catch (error) {
      this.logger.error(`Error deleting file ${fileName} from S3:`, error.stack);
      throw new InternalServerErrorException('Error deleting file from S3');
    }
  }
}
