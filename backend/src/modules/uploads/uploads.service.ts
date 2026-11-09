
import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow<string>(
        'CLOUDINARY_CLOUD_NAME',
      ),
      api_key: this.configService.getOrThrow<string>(
        'CLOUDINARY_API_KEY',
      ),
      api_secret: this.configService.getOrThrow<string>(
        'CLOUDINARY_API_SECRET',
      ),
      secure: true,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      // Upload PDFs as image resources so browsers can display them.
      const resourceType = 'image';

      const publicId = `${Date.now()}-${file.originalname
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '-')}`;

      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'portfolio',
            public_id: publicId,
            resource_type: resourceType,
          },
          (error, uploadResult) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(uploadResult);
          },
        );

        uploadStream.end(file.buffer);
      });

      return {
        message: 'File uploaded successfully.',
        file: {
          url: result.secure_url,
          publicId: result.public_id,
          fileName: file.originalname,
          fileSize: result.bytes,
          format: result.format,
          resourceType: result.resource_type,
        },
      };
    } catch {
      throw new InternalServerErrorException(
        'File upload failed. Please try again.',
      );
    }
  }
}
