import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Resume,
  ResumeDocument,
} from './schemas/resume.schema.js';

import { CreateResumeDto } from './dto/create-resume.dto.js';
import { UpdateResumeDto } from './dto/update-resume.dto.js';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume.name)
    private readonly resumeModel: Model<ResumeDocument>,
  ) {}

  async create(createResumeDto: CreateResumeDto) {
    // Keep only one active resume.
    if (createResumeDto.isActive !== false) {
      await this.resumeModel.updateMany(
        {},
        { $set: { isActive: false } },
      );
    }

    const resume = new this.resumeModel(createResumeDto);
    return resume.save();
  }

  async findAll() {
    return this.resumeModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  async findActive() {
    const resume = await this.resumeModel
      .findOne({ isActive: true })
      .sort({ createdAt: -1 })
      .exec();

    if (!resume) {
      throw new NotFoundException('No active resume found.');
    }

    return resume;
  }

  async findOne(id: string) {
    const resume = await this.resumeModel.findById(id).exec();

    if (!resume) {
      throw new NotFoundException('Resume not found.');
    }

    return resume;
  }

  async update(id: string, updateResumeDto: UpdateResumeDto) {
    const resume = await this.resumeModel.findById(id).exec();

    if (!resume) {
      throw new NotFoundException('Resume not found.');
    }

    if (updateResumeDto.isActive === true) {
      await this.resumeModel.updateMany(
        { _id: { $ne: id } },
        { $set: { isActive: false } },
      );
    }

    Object.assign(resume, updateResumeDto);

    return resume.save();
  }

  async remove(id: string) {
    const resume = await this.resumeModel
      .findByIdAndDelete(id)
      .exec();

    if (!resume) {
      throw new NotFoundException('Resume not found.');
    }

    return {
      message: 'Resume deleted successfully.',
    };
  }
}