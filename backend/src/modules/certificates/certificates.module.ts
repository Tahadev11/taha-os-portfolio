import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CertificatesController } from './certificates.controller.js';
import { CertificatesService } from './certificates.service.js';

import {
  Certificate,
  CertificateSchema,
} from './schemas/certificate.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Certificate.name,
        schema: CertificateSchema,
      },
    ]),
  ],
  controllers: [CertificatesController],
  providers: [CertificatesService],
  exports: [CertificatesService],
})
export class CertificatesModule {}