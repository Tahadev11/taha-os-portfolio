import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Certificate,
  CertificateDocument,
} from './schemas/certificate.schema.js';

import { CreateCertificateDto } from './dto/create-certificate.dto.js';
import { UpdateCertificateDto } from './dto/update-certificate.dto.js';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectModel(Certificate.name)
    private readonly certificateModel: Model<CertificateDocument>,
  ) {}

  async create(createCertificateDto: CreateCertificateDto) {
    const certificate = new this.certificateModel(
      createCertificateDto,
    );

    return certificate.save();
  }

  async findAll() {
    return this.certificateModel
      .find()
      .sort({ sortOrder: 1, issueDate: -1 })
      .exec();
  }

  async findVisible() {
    return this.certificateModel
      .find({ isVisible: true })
      .sort({ sortOrder: 1, issueDate: -1 })
      .exec();
  }

  async findOne(id: string) {
    const certificate = await this.certificateModel
      .findById(id)
      .exec();

    if (!certificate) {
      throw new NotFoundException('Certificate not found.');
    }

    return certificate;
  }

  async update(
    id: string,
    updateCertificateDto: UpdateCertificateDto,
  ) {
    const certificate = await this.certificateModel
      .findById(id)
      .exec();

    if (!certificate) {
      throw new NotFoundException('Certificate not found.');
    }

    Object.assign(certificate, updateCertificateDto);

    return certificate.save();
  }

  async remove(id: string) {
    const certificate = await this.certificateModel
      .findByIdAndDelete(id)
      .exec();

    if (!certificate) {
      throw new NotFoundException('Certificate not found.');
    }

    return {
      message: 'Certificate deleted successfully.',
    };
  }
}